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

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '4mb' }));
app.use(express.static(path.join(__dirname)));

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
  req.setTimeout(15000, () => { req.destroy(new Error('JIRA request timed out')); });
  req.end();
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
    maxResults = 100,
    startAt    = 0
  } = req.body || {};

  if (!domain || !email || !token)
    return res.status(400).json({ error: 'domain, email and token are required' });

  const f    = fields.replace(/\s/g, '');
  const q    = encodeURIComponent(jql);
  const path = `/rest/api/3/search?jql=${q}&fields=${f}&maxResults=${maxResults}&startAt=${startAt}`;

  jiraGet(domain, email, token, path, (err, data, status) => {
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  Qorix Product Management Portal             ║');
  console.log(`║  http://localhost:${PORT}                         ║`);
  console.log('║                                              ║');
  console.log('║  JIRA proxy active on /api/jira/*            ║');
  console.log('╚══════════════════════════════════════════════╝\n');
});
