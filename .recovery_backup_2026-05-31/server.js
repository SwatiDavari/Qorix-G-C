'use strict';
/* ─── Qorix Portal — Node.js Server ────────────────────────────────────────
   Run:  npm install && npm start
   Open: http://localhost:3000/index.html

   This server does two things:
   1. Serves all static HTML/JS/CSS files
   2. Proxies JIRA Cloud REST API calls (browsers are blocked by CORS)
   ─────────────────────────────────────────────────────────────────────────── */

const express = require('express');
const cors    = require('cors');
const https   = require('https');
const path    = require('path');
const os      = require('os');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '4mb' }));
app.use(express.static(path.join(__dirname)));

const JIRA_DEBUG = String(process.env.JIRA_DEBUG || '').toLowerCase() === 'true';
const logJira = (...args) => {
  if (JIRA_DEBUG) console.log(...args);
};

function getLocalIpv4Address() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const net of Object.values(nets)) {
    for (const addr of net || []) {
      if (!addr || addr.family !== 'IPv4' || addr.internal) continue;
      if (String(addr.address).startsWith('169.254.')) continue;
      candidates.push(addr.address);
    }
  }

  if (!candidates.length) return null;

  const isPrivate = ip =>
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip);

  candidates.sort((a, b) => Number(isPrivate(b)) - Number(isPrivate(a)));
  return candidates[0] || null;
}

/* ── JIRA HTTPS helper ─────────────────────────────────────────────────── */
function jiraGet(domain, email, token, apiPath, cb) {
  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  const options = {
    hostname: domain,
    path: apiPath,
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept':        'application/json',
      'Content-Type':  'application/json',
      'User-Agent':    'Qorix-Portal/1.0'
    }
  };
  const req = https.request(options, res => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        cb(null, body, res.statusCode);
      } catch (e) {
        cb(new Error('Invalid JSON from JIRA: ' + e.message));
      }
    });
  });
  req.on('error', cb);
  req.setTimeout(30000, () => { req.destroy(new Error('JIRA request timed out')); });
  req.end();
}

function jiraPost(domain, email, token, apiPath, payload, cb) {
  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  const body = JSON.stringify(payload || {});
  const options = {
    hostname: domain,
    path: apiPath,
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept':        'application/json',
      'Content-Type':  'application/json',
      'Content-Length': Buffer.byteLength(body),
      'User-Agent':    'Qorix-Portal/1.0'
    }
  };
  const req = https.request(options, res => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString() || '{}';
        const parsed = JSON.parse(text);
        cb(null, parsed, res.statusCode);
      } catch (e) {
        cb(new Error('Invalid JSON from JIRA: ' + e.message));
      }
    });
  });
  req.on('error', cb);
  req.setTimeout(30000, () => { req.destroy(new Error('JIRA request timed out')); });
  req.write(body);
  req.end();
}

function runJiraSearchPage(domain, email, token, { jql, fields, maxResults, startAt, nextPageToken }, cb) {
  const fieldList = String(fields || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const cappedMax = Math.max(1, Math.min(100, Number(maxResults) || 100));
  const safeStartAt = Number(startAt) || 0;
  const fieldParam = fieldList.length ? fieldList : ['summary','status','priority','assignee','created'];
  const payload = {
    jql: String(jql || 'ORDER BY created DESC'),
    fields: fieldParam,
    maxResults: cappedMax
  };

  if (nextPageToken) payload.nextPageToken = String(nextPageToken);
  if (!nextPageToken && safeStartAt > 0) payload.startAt = safeStartAt;

  logJira(`[JIRA] POST search/jql maxResults=${cappedMax} nextPageToken=${nextPageToken ? 'yes' : 'no'} startAt=${safeStartAt}`);

  jiraPost(domain, email, token, '/rest/api/3/search/jql', payload, (err, data, status) => {
    if (err) return cb(err);
    logJira(`[JIRA] response status=${status} total=${data?.total} issues=${data?.issues?.length} isLast=${data?.isLast} nextPageToken=${data?.nextPageToken ? 'yes' : 'no'}`);
    cb(null, data, status);
  });
}

function runJiraSearch(domain, email, token, { jql, fields, maxResults, startAt, fetchAll }, cb) {
  const shouldFetchAll = !!fetchAll;
  const pageSize = Math.max(1, Math.min(100, Number(maxResults) || 100));
  const firstStartAt = Number(startAt) || 0;

  if (!shouldFetchAll) {
    return runJiraSearchPage(domain, email, token, { jql, fields, maxResults: pageSize, startAt: firstStartAt }, cb);
  }

  const collected = [];
  const seenIssueKeys = new Set();
  const hardCap = Math.max(1, Number(maxResults) || 100);

  const fetchNext = (pageToken) => {
    runJiraSearchPage(domain, email, token, { jql, fields, maxResults: pageSize, startAt: firstStartAt, nextPageToken: pageToken }, (err, data, status) => {
      if (err) return cb(err);
      if (status !== 200) return cb(null, data, status);

      const issues = Array.isArray(data?.issues) ? data.issues : [];
      let newIssuesAdded = 0;
      for (const issue of issues) {
        const issueKey = issue?.key || issue?.id || JSON.stringify(issue);
        if (!seenIssueKeys.has(issueKey)) {
          seenIssueKeys.add(issueKey);
          collected.push(issue);
          newIssuesAdded++;
        }
      }

      const total = Number(data?.total);
      const fetchedCount = collected.length;
      const reachedTotal = Number.isFinite(total) && fetchedCount >= total;
      const reachedCap = fetchedCount >= hardCap;
      const noMoreIssues = issues.length === 0;
      const noProgress = issues.length > 0 && newIssuesAdded === 0;
      const isLast = data?.isLast === true;
      const nextToken = data?.nextPageToken;
      const noNextToken = !nextToken;

      if (reachedTotal || reachedCap || noMoreIssues || noProgress || isLast || noNextToken) {
        return cb(null, { ...data, issues: collected, maxResults: fetchedCount, startAt: firstStartAt, total: fetchedCount }, status);
      }

      fetchNext(nextToken);
    });
  };

  fetchNext(undefined);
}

/* ── POST /api/jira/test — verify credentials ──────────────────────────── */
app.post('/api/jira/test', (req, res) => {
  const { domain, email, token } = req.body || {};
  if (!domain || !email || !token)
    return res.status(400).json({ ok: false, error: 'domain, email and token are required' });

  jiraGet(domain, email, token, '/rest/api/3/myself', (err, data, status) => {
    if (err)       return res.status(500).json({ ok: false, error: err.message });
    if (status !== 200) return res.status(status).json({ ok: false, error: data?.message || `HTTP ${status}` });
    res.json({ ok: true, user: data.displayName, account: data.emailAddress });
  });
});

/* ── POST /api/jira/projects — list accessible projects ────────────────── */
app.post('/api/jira/projects', (req, res) => {
  const { domain, email, token } = req.body || {};
  if (!domain || !email || !token)
    return res.status(400).json({ error: 'Missing credentials' });

  jiraGet(domain, email, token, '/rest/api/3/project?maxResults=50', (err, data, status) => {
    if (err)       return res.status(500).json({ error: err.message });
    if (status !== 200) return res.status(status).json({ error: data?.message || `HTTP ${status}` });
    res.json(data);
  });
});

/* ── POST /api/jira/search — JQL issue search ──────────────────────────── */
app.post('/api/jira/search', (req, res) => {
  const {
    domain, email, token,
    jql        = 'ORDER BY created DESC',
    fields     = 'summary,status,priority,description,assignee,created,updated,issuetype,labels,comment,duedate',
    maxResults = 2000,
    startAt    = 0,
    fetchAll   = false
  } = req.body || {};

  if (!domain || !email || !token)
    return res.status(400).json({ error: 'domain, email and token are required' });

  runJiraSearch(domain, email, token, { jql, fields, maxResults, startAt, fetchAll }, (err, data, status) => {
    if (err) return res.status(500).json({ error: err.message });
    if (status !== 200) {
      const msg = (data?.errorMessages || []).join('; ') || data?.message || `HTTP ${status}`;
      return res.status(status).json({ error: msg });
    }
    res.json(data);
  });
});

/* ── GET /api/jira — legacy compatibility wrapper ─────────────────────── */
app.get('/api/jira', (req, res) => {
  const {
    domain,
    email,
    token,
    jql = 'ORDER BY created DESC',
    fields = 'summary,status,priority,description,assignee,created,updated,issuetype,labels,comment,duedate',
    maxResults = 2000,
    startAt = 0,
    fetchAll = false
  } = req.query || {};

  if (!domain || !email || !token)
    return res.status(400).json({ error: 'domain, email and token are required' });

  runJiraSearch(String(domain), String(email), String(token), { jql: String(jql), fields, maxResults, startAt, fetchAll: String(fetchAll).toLowerCase() === 'true' }, (err, data, status) => {
    if (err) return res.status(500).json({ error: err.message });
    if (status !== 200) {
      const msg = (data?.errorMessages || []).join('; ') || data?.message || `HTTP ${status}`;
      return res.status(status).json({ error: msg });
    }
    res.json(data);
  });
});

/* ── POST /api/jira/issue — single issue detail ────────────────────────── */
app.post('/api/jira/issue', (req, res) => {
  const { domain, email, token, issueKey } = req.body || {};
  if (!domain || !email || !token || !issueKey)
    return res.status(400).json({ error: 'domain, email, token and issueKey are required' });

  jiraGet(domain, email, token, `/rest/api/3/issue/${issueKey}`, (err, data, status) => {
    if (err) return res.status(500).json({ error: err.message });
    if (status !== 200) return res.status(status).json({ error: data?.message || `HTTP ${status}` });
    res.json(data);
  });
});
/* ── GET /api/dashboard — GRC stub (returns data from data.js shape) ────── */
app.get('/api/dashboard', (req, res) => {
  // Return a realistic mock payload so the GRC tab works without a real GRC backend
  const now  = new Date();
  const priorities = ['High', 'Medium', 'Low'];
  const statuses   = ['Open', 'In Progress', 'Done', 'Closed'];
  const assignees  = ['Alice', 'Bob', 'Carol', 'David', 'Eve'];

  const issues = Array.from({ length: 40 }, (_, i) => {
    const priority = priorities[i % 3];
    const status   = statuses[i % 4];
    const created  = new Date(now - (i + 1) * 86400000 * 3).toISOString();
    const resolved = status === 'Done' || status === 'Closed'
      ? new Date(now - i * 86400000).toISOString() : null;
    return {
      key:      `GRC-${1000 + i}`,
      id:       String(1000 + i),
      summary:  `GRC Issue ${i + 1} — ${priority} priority`,
      title:    `GRC Issue ${i + 1}`,
      status,
      _status:  status,
      priority,
      _priority: priority,
      assignee: assignees[i % assignees.length],
      created,
      resolved
    };
  });

  res.json({ ok: true, total: issues.length, issues });
});
/* ── GET /api/health ───────────────────────────────────────────────────── */
app.get('/api/health', (_, res) =>
  res.json({ ok: true, ts: new Date().toISOString(), version: '1.0.0' })
);

/* ── Catch-all → index.html ────────────────────────────────────────────── */
app.get('*', (req, res) => {
  if (!req.path.includes('.'))
    res.sendFile(path.join(__dirname, 'index.html'));
  else
    res.status(404).send('Not found');
});

/* ── Start ─────────────────────────────────────────────────────────────── */
const START_PORT = Number(process.env.PORT) || 3000;

function startServer(port, retriesLeft = 10) {
  const server = app.listen(port, '0.0.0.0', () => {
    const localLink = `http://localhost:${port}`;
    const lanIp = getLocalIpv4Address();
    const networkLink = lanIp ? `http://${lanIp}:${port}` : 'N/A';

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  Qorix Product Management Portal             ║');
    console.log(`║  Local:   ${localLink}`);
    console.log(`║  Network: ${networkLink}`);
    console.log('║                                              ║');
    console.log('║  JIRA proxy active on /api/jira/*            ║');
    console.log('╚══════════════════════════════════════════════╝\n');
  });

  server.on('error', err => {
    if (err && err.code === 'EADDRINUSE' && retriesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Trying port ${nextPort}...`);
      return startServer(nextPort, retriesLeft - 1);
    }

    console.error('Failed to start server:', err && err.message ? err.message : err);
    process.exit(1);
  });
}

startServer(START_PORT);
