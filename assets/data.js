/* ─── Qorix Product Management — Shared Data Layer ─────────────────────── */

const QX = {
  blue:      '#3C00FF',
  cyan:      '#00FFFF',
  lime:      '#D7FF3C',
  navy:      '#0E2841',
  steelBlue: '#156082',
  sky:       '#0F9ED5',
  orange:    '#E97132',
  green:     '#4EA72E',
  purple:    '#A02B93',
  gray:      '#E8E8E8'
};

const PRODUCTS = [
  {
    id:'nexus', name:'Nexus Platform', abbr:'NX',
    tagline:'Core B2B SaaS powering enterprise workflows',
    pm:'Aisha Rahman', pmInitials:'AR',
    status:'on-track', phase:'Development', completion:72,
    revenue:'$2.4M', mrr:'$200K', users:'14,200', adoption:'68%',
    nps:71, churn:'2.1%',
    updated:'2026-05-07', color: QX.blue,
    budget:850, actual:610, forecast:830, fteCost:320,
    fte:18, description:'Core B2B SaaS platform enabling enterprise teams to streamline operations, automate workflows, and integrate with 200+ tools. Currently in active development with v3.2 shipping this quarter.',
    tags:['B2B','SaaS','Enterprise','Workflow']
  },
  {
    id:'pulse', name:'Pulse Mobile', abbr:'PM',
    tagline:'Consumer real-time engagement, anywhere',
    pm:'Jordan Lee', pmInitials:'JL',
    status:'at-risk', phase:'Launch', completion:88,
    revenue:'$820K', mrr:'$68K', users:'52,000', adoption:'41%',
    nps:58, churn:'4.7%',
    updated:'2026-05-08', color: QX.orange,
    budget:420, actual:398, forecast:445, fteCost:210,
    fte:14, description:'Consumer mobile application for real-time engagement and notifications. iOS launch imminent; Android in parallel development. App Store submission pending privacy label update.',
    tags:['Mobile','Consumer','iOS','Android']
  },
  {
    id:'datasphere', name:'DataSphere Analytics', abbr:'DS',
    tagline:'Enterprise-grade data intelligence at scale',
    pm:'Priya Nair', pmInitials:'PN',
    status:'on-track', phase:'Scale', completion:91,
    revenue:'$3.1M', mrr:'$258K', users:'8,700', adoption:'83%',
    nps:82, churn:'1.2%',
    updated:'2026-05-06', color: QX.sky,
    budget:1100, actual:890, forecast:1050, fteCost:440,
    fte:22, description:'Advanced analytics suite providing real-time dashboards, ML-powered anomaly detection, and natural language querying. Scaling into APAC with SOC 2 certification in progress.',
    tags:['Analytics','ML','Data','Enterprise']
  },
  {
    id:'coreapi', name:'CoreAPI Gateway', abbr:'CA',
    tagline:'Unified API gateway and developer ecosystem',
    pm:'Marcus Webb', pmInitials:'MW',
    status:'delayed', phase:'Development', completion:44,
    revenue:'$510K', mrr:'$42K', users:'3,200', adoption:'29%',
    nps:49, churn:'5.9%',
    updated:'2026-05-05', color:'#ef4444',
    budget:310, actual:195, forecast:360, fteCost:135,
    fte:9, description:'Unified API gateway enabling partner integrations, developer portal, and usage-based billing. Design freeze is overdue by 3 weeks. Vendor API deprecation risk active.',
    tags:['API','Developer','Platform','Integration']
  },
  {
    id:'ehub', name:'EnterpriseHub', abbr:'EH',
    tagline:'Next-gen portal for integrated service delivery',
    pm:'Sofia Chen', pmInitials:'SC',
    status:'at-risk', phase:'Discovery', completion:21,
    revenue:'—', mrr:'—', users:'—', adoption:'—',
    nps:'—', churn:'—',
    updated:'2026-05-04', color: QX.purple,
    budget:180, actual:42, forecast:210, fteCost:60,
    fte:4, description:'Next-generation enterprise portal for integrated service delivery across departments. Currently in Discovery phase with stakeholder workshops underway. PM role and product ownership need formal assignment.',
    tags:['Enterprise','Portal','Discovery','B2B']
  }
];

const ROADMAP = {
  nexus:[
    {col:'now',  type:'milestone', title:'v3.2 Feature Release',       desc:'Auth redesign + SSO rollout',            dep:'Platform Team', date:'May 2026'},
    {col:'now',  type:'init',      title:'Performance Hardening',       desc:'p95 latency target < 200ms',             dep:null,            date:'May 2026'},
    {col:'now',  type:'dep',       title:'Compliance Review',           desc:'Legal sign-off for v3.2',                dep:'Legal Team',    date:'Jun 2026'},
    {col:'next', type:'init',      title:'Multi-tenant Billing Engine', desc:'Stripe integration, usage metering',     dep:null,            date:'Jul 2026'},
    {col:'next', type:'milestone', title:'Enterprise GA',               desc:'General availability to all tiers',      dep:null,            date:'Aug 2026'},
    {col:'later',type:'init',      title:'AI Feature Layer',            desc:'LLM-assisted workflow automation',        dep:null,            date:'Q4 2026'},
    {col:'later',type:'milestone', title:'v4.0 Architecture',           desc:'Full microservices migration',           dep:'Infra Team',    date:'Q1 2027'}
  ],
  pulse:[
    {col:'now',  type:'milestone', title:'iOS App Store Launch',        desc:'Target: May 20 2026',                    dep:null,            date:'May 2026'},
    {col:'now',  type:'init',      title:'Push Notification Infra',     desc:'FCM + APNs integrated',                  dep:null,            date:'May 2026'},
    {col:'now',  type:'dep',       title:'Privacy Labels Fix',          desc:'Required before App Store approval',     dep:'Legal/Design',  date:'May 2026'},
    {col:'next', type:'init',      title:'Android Feature Parity',      desc:'Match iOS feature set',                  dep:null,            date:'Q3 2026'},
    {col:'next', type:'dep',       title:'Payment Gateway',             desc:'Stripe integration for in-app purchase', dep:'Stripe API',    date:'Q3 2026'},
    {col:'later',type:'milestone', title:'100K MAU Target',             desc:'Growth & paid acquisition campaign',     dep:null,            date:'Q4 2026'},
    {col:'later',type:'init',      title:'Offline Mode (PWA)',          desc:'Full offline support',                   dep:null,            date:'Q1 2027'}
  ],
  datasphere:[
    {col:'now',  type:'init',      title:'Real-time Dashboard v2',      desc:'WebSocket streaming + live charts',      dep:null,            date:'May 2026'},
    {col:'now',  type:'milestone', title:'SOC 2 Type II Cert',          desc:'Audit in progress with Drata',           dep:'SecOps',        date:'Jun 2026'},
    {col:'next', type:'init',      title:'ML Anomaly Detection',        desc:'Python model serving via FastAPI',        dep:null,            date:'Jul 2026'},
    {col:'next', type:'dep',       title:'Data Warehouse Migration',    desc:'Snowflake → managed lakehouse',           dep:'Infra Team',    date:'Aug 2026'},
    {col:'later',type:'milestone', title:'$5M ARR Milestone',           desc:'APAC expansion + new pricing tiers',     dep:null,            date:'Q4 2026'},
    {col:'later',type:'init',      title:'Natural Language Query',      desc:'LLM layer on top of data schema',        dep:null,            date:'Q1 2027'}
  ],
  coreapi:[
    {col:'now',  type:'milestone', title:'API v2 Design Freeze',        desc:'⚠ Delayed 3 weeks — critical',           dep:null,            date:'May 2026'},
    {col:'now',  type:'init',      title:'Rate Limiting Engine',        desc:'Redis-based throttle + quota mgmt',      dep:null,            date:'Jun 2026'},
    {col:'now',  type:'dep',       title:'Security Review',             desc:'SecOps sign-off required',               dep:'SecOps Team',   date:'Jun 2026'},
    {col:'next', type:'init',      title:'Developer Portal',            desc:'Docs site + interactive sandbox',        dep:null,            date:'Aug 2026'},
    {col:'next', type:'milestone', title:'Public Beta Launch',          desc:'Invite-only developer access',           dep:null,            date:'Sep 2026'},
    {col:'later',type:'milestone', title:'Partner Ecosystem',           desc:'10 certified integrations',              dep:null,            date:'Q4 2026'},
    {col:'later',type:'init',      title:'Monetisation Layer',         desc:'Usage-based billing model',               dep:null,            date:'Q1 2027'}
  ],
  ehub:[
    {col:'now',  type:'init',      title:'Discovery Workshops',         desc:'Stakeholder interviews (4 scheduled)',   dep:null,            date:'May 2026'},
    {col:'now',  type:'milestone', title:'PRD Sign-off',                desc:'⚠ Ownership undefined — blocked',        dep:'Leadership',    date:'Jun 2026'},
    {col:'next', type:'init',      title:'Architecture Proposal',       desc:'Pending PM + tech lead assignment',      dep:null,            date:'Jul 2026'},
    {col:'next', type:'dep',       title:'Legacy System Audit',         desc:'IT Ops access required',                 dep:'IT Ops',        date:'Aug 2026'},
    {col:'later',type:'milestone', title:'Prototype Demo',              desc:'Internal stakeholder review',            dep:null,            date:'Q1 2027'},
    {col:'later',type:'init',      title:'Pilot Rollout',               desc:'3 anchor enterprise clients',            dep:null,            date:'Q2 2027'}
  ]
};

const TEAM = {
  nexus:[
    {name:'Aisha Rahman',   role:'Product Manager', allocation:100, type:'pm',     initials:'AR'},
    {name:'Dev Team Alpha', role:'Engineering Lead', allocation:100, type:'eng',    initials:'DA'},
    {name:'Lena Kovacs',    role:'Senior Engineer',  allocation:100, type:'eng',    initials:'LK'},
    {name:'Sam Torres',     role:'Engineer',         allocation:80,  type:'eng',    initials:'ST'},
    {name:'Yuki Tanaka',    role:'Engineer',         allocation:100, type:'eng',    initials:'YT'},
    {name:'Rin Okawa',      role:'Engineer',         allocation:100, type:'eng',    initials:'RO'},
    {name:'Obi Mensah',     role:'Engineer',         allocation:100, type:'eng',    initials:'OM'},
    {name:'Cai Zheng',      role:'Engineer',         allocation:100, type:'eng',    initials:'CZ'},
    {name:'Mia Patel',      role:'UX Designer',      allocation:80,  type:'design', initials:'MP'},
    {name:'Felix Brand',    role:'UI Designer',      allocation:60,  type:'design', initials:'FB', shared:true},
    {name:'Nour Al-Rashid', role:'QA Lead',          allocation:100, type:'qa',     initials:'NA'},
    {name:'Tomas Varga',    role:'QA Engineer',      allocation:100, type:'qa',     initials:'TV'},
    {name:'Zara Osei',      role:'QA Engineer',      allocation:80,  type:'qa',     initials:'ZO'},
    {name:'Leo Petrov',     role:'DevOps',           allocation:100, type:'ops',    initials:'LP'},
    {name:'Priya Das',      role:'DevOps',           allocation:60,  type:'ops',    initials:'PD', shared:true}
  ],
  pulse:[
    {name:'Jordan Lee',     role:'Product Manager',  allocation:100, type:'pm',     initials:'JL'},
    {name:'Chris Park',     role:'Engineering Lead',  allocation:100, type:'eng',    initials:'CP'},
    {name:'Amara Diop',     role:'iOS Engineer',     allocation:100, type:'eng',    initials:'AD'},
    {name:'Kai Sorensen',   role:'Android Engineer', allocation:100, type:'eng',    initials:'KS'},
    {name:'Tess Ricci',     role:'Backend Engineer', allocation:100, type:'eng',    initials:'TR'},
    {name:'Hugo Ferreira',  role:'Engineer',         allocation:80,  type:'eng',    initials:'HF'},
    {name:'Nadia Cohn',     role:'Engineer',         allocation:100, type:'eng',    initials:'NC'},
    {name:'Felix Brand',    role:'UI Designer',      allocation:40,  type:'design', initials:'FB', shared:true},
    {name:'Dani Reyes',     role:'UX Designer',      allocation:100, type:'design', initials:'DR'},
    {name:'Olu Adebayo',    role:'UX Designer',      allocation:100, type:'design', initials:'OA'},
    {name:'Mei Lin',        role:'QA Engineer',      allocation:100, type:'qa',     initials:'ML'},
    {name:'Bram Visser',    role:'QA Engineer',      allocation:100, type:'qa',     initials:'BV'},
    {name:'Priya Das',      role:'DevOps',           allocation:40,  type:'ops',    initials:'PD', shared:true}
  ],
  datasphere:[
    {name:'Priya Nair',     role:'Product Manager',  allocation:100, type:'pm',     initials:'PN'},
    {name:'Raj Iyer',       role:'Product Manager',  allocation:100, type:'pm',     initials:'RI'},
    {name:'Eng Lead DS',    role:'Engineering Lead',  allocation:100, type:'eng',    initials:'EL'},
    {name:'Ana Sousa',      role:'Data Engineer',    allocation:100, type:'eng',    initials:'AS'},
    {name:'Ivan Popov',     role:'Data Engineer',    allocation:100, type:'eng',    initials:'IP'},
    {name:'Zhen Wu',        role:'ML Engineer',      allocation:100, type:'eng',    initials:'ZW'},
    {name:'Layla Hassan',   role:'ML Engineer',      allocation:100, type:'eng',    initials:'LH'},
    {name:'Carlos Ruiz',    role:'Backend Engineer', allocation:100, type:'eng',    initials:'CR'},
    {name:'Nia Owusu',      role:'Engineer',         allocation:100, type:'eng',    initials:'NO'},
    {name:'Sven Koch',      role:'Engineer',         allocation:100, type:'eng',    initials:'SK'},
    {name:'Fatima Al-Amin', role:'Engineer',         allocation:80,  type:'eng',    initials:'FA'},
    {name:'Dani Reyes',     role:'UX Designer',      allocation:20,  type:'design', initials:'DR', shared:true},
    {name:'Olu Adebayo',    role:'UI Designer',      allocation:20,  type:'design', initials:'OA', shared:true},
    {name:'QA Lead DS',     role:'QA Lead',          allocation:100, type:'qa',     initials:'QL'},
    {name:'Mara Blom',      role:'QA Engineer',      allocation:100, type:'qa',     initials:'MB'},
    {name:'Ryo Fujita',     role:'QA Engineer',      allocation:100, type:'qa',     initials:'RF'},
    {name:'Elan Bright',    role:'QA Engineer',      allocation:100, type:'qa',     initials:'EB'},
    {name:'Leo Petrov',     role:'DevOps',           allocation:20,  type:'ops',    initials:'LP', shared:true},
    {name:'Priya Das',      role:'DevOps',           allocation:20,  type:'ops',    initials:'PD', shared:true}
  ],
  coreapi:[
    {name:'Marcus Webb',    role:'Product Manager',  allocation:100, type:'pm',     initials:'MW'},
    {name:'Eng Lead CA',    role:'Engineering Lead',  allocation:100, type:'eng',    initials:'EL'},
    {name:'Sam Torres',     role:'Engineer',         allocation:20,  type:'eng',    initials:'ST', shared:true},
    {name:'Vera Morin',     role:'Backend Engineer', allocation:100, type:'eng',    initials:'VM'},
    {name:'Dex Anand',      role:'API Engineer',     allocation:100, type:'eng',    initials:'DA'},
    {name:'Ren Nakamura',   role:'Engineer',         allocation:100, type:'eng',    initials:'RN'},
    {name:'Mia Patel',      role:'UX Designer',      allocation:20,  type:'design', initials:'MP', shared:true},
    {name:'Zara Osei',      role:'QA Engineer',      allocation:20,  type:'qa',     initials:'ZO', shared:true},
    {name:'Priya Das',      role:'DevOps',           allocation:20,  type:'ops',    initials:'PD', shared:true}
  ],
  ehub:[
    {name:'Sofia Chen',     role:'Product Manager',  allocation:100, type:'pm',     initials:'SC'},
    {name:'Intern Eng A',   role:'Engineer (Intern)', allocation:100, type:'eng',    initials:'IA'},
    {name:'Intern Eng B',   role:'Engineer (Intern)', allocation:100, type:'eng',    initials:'IB'},
    {name:'Felix Brand',    role:'UI Designer',      allocation:20,  type:'design', initials:'FB', shared:true}
  ]
};

const RISKS = {
  nexus:[
    {id:'r3', title:'SSO Integration Bug',         sev:'Medium', impact:'Technical', owner:'Aisha Rahman',  mitigation:'Hot-fix branch open, ETA May 12',               status:'In Progress', score:5, created:'2026-05-01'},
    {id:'r8', title:'Performance Regression',      sev:'Low',    impact:'Technical', owner:'Dev Team Alpha', mitigation:'Load testing scheduled for May 15',             status:'Closed',      score:2, created:'2026-04-20'}
  ],
  pulse:[
    {id:'r1', title:'App Store Rejection Risk',    sev:'High',   impact:'Delivery',  owner:'Jordan Lee',    mitigation:'Pre-review checklist done; TestFlight deployed',  status:'In Progress', score:8, created:'2026-05-03'},
    {id:'r7', title:'Budget Overrun Risk',         sev:'Medium', impact:'Financial', owner:'Jordan Lee',    mitigation:'Scope reduction options under leadership review',  status:'In Progress', score:5, created:'2026-04-28'}
  ],
  datasphere:[
    {id:'r4', title:'SOC 2 Audit Gap',             sev:'High',   impact:'Financial', owner:'Priya Nair',    mitigation:'3rd-party auditor engaged; gap remediation plan',  status:'Open',        score:9, created:'2026-05-05'}
  ],
  coreapi:[
    {id:'r2', title:'API Design Freeze Delay',     sev:'High',   impact:'Delivery',  owner:'Marcus Webb',   mitigation:'Escalated to CTO; sprint replanned with new dates',status:'Open',        score:9, created:'2026-05-04'},
    {id:'r6', title:'Vendor API Deprecation',      sev:'Medium', impact:'Technical', owner:'Marcus Webb',   mitigation:'Evaluating 3 alternative providers by May 30',    status:'Open',        score:6, created:'2026-05-01'}
  ],
  ehub:[
    {id:'r5', title:'Undefined Product Ownership', sev:'Medium', impact:'Delivery',  owner:'— Unassigned —', mitigation:'⚠ No mitigation plan defined',                  status:'Open',        score:6, created:'2026-05-06'}
  ]
};

const COMPLIANCE = {
  nexus:[
    {name:'GDPR Data Processing', area:'Data',     status:'pass', desc:'DPA signed, data map complete',      deadline:'—'},
    {name:'SOC 2 Type II',        area:'Security', status:'warn', desc:'Renewal audit due Jun 2026',          deadline:'2026-06-30'},
    {name:'ISO 27001',            area:'Security', status:'pass', desc:'Certified 2025, valid until 2027',    deadline:'2027-01-01'},
    {name:'Penetration Test',     area:'Security', status:'pass', desc:'Q1 2026 — no critical findings',      deadline:'—'}
  ],
  pulse:[
    {name:'GDPR Consent Flow',    area:'Data',        status:'warn', desc:'Consent UI under legal review',       deadline:'2026-05-31'},
    {name:'App Privacy Labels',   area:'Compliance',  status:'fail', desc:'Missing labels — blocks App Store',   deadline:'2026-05-20'},
    {name:'CCPA Compliance',      area:'Data',        status:'pass', desc:'Privacy policy updated Feb 2026',     deadline:'—'},
    {name:'Security Scan',        area:'Security',    status:'warn', desc:'2 medium CVEs open (CVSS 5.4, 5.1)',  deadline:'2026-05-25'}
  ],
  datasphere:[
    {name:'SOC 2 Audit',          area:'Security', status:'warn', desc:'In progress — 3 controls failing',    deadline:'2026-06-15'},
    {name:'GDPR Article 30',      area:'Data',     status:'pass', desc:'Record of processing activities OK',  deadline:'—'},
    {name:'Data Retention Policy',area:'Data',     status:'pass', desc:'Automated purge policy active',       deadline:'—'},
    {name:'Pen Test',             area:'Security', status:'pass', desc:'Q4 2025 — clean result',              deadline:'—'}
  ],
  coreapi:[
    {name:'API Security Review',  area:'Security',  status:'fail', desc:'SecOps review not scheduled',        deadline:'2026-06-01'},
    {name:'OWASP Top 10 Check',   area:'Security',  status:'warn', desc:'2 issues flagged (A1, A5)',          deadline:'2026-05-30'},
    {name:'GDPR Data in Transit', area:'Data',      status:'pass', desc:'TLS 1.3 enforced end-to-end',        deadline:'—'},
    {name:'Dependency Audit',     area:'Technical', status:'warn', desc:'14 outdated packages detected',       deadline:'2026-05-31'}
  ],
  ehub:[
    {name:'GDPR Assessment',      area:'Data',     status:'fail', desc:'Not started — too early in Discovery',deadline:'2026-07-01'},
    {name:'Security Baseline',    area:'Security', status:'fail', desc:'No security plan defined',            deadline:'2026-07-01'},
    {name:'Audit Readiness',      area:'Compliance',status:'fail',desc:'N/A at Discovery stage',              deadline:'TBD'},
    {name:'Data Architecture',    area:'Data',     status:'warn', desc:'Pending architecture sign-off',       deadline:'2026-06-30'}
  ]
};

const ACTIVITY = [
  {ts:'2026-05-08 14:32', product:'pulse',      pname:'Pulse Mobile',       type:'risk',       msg:'Risk "App Store Rejection" status updated to In Progress'},
  {ts:'2026-05-08 11:15', product:'nexus',      pname:'Nexus Platform',     type:'roadmap',    msg:'Milestone "v3.2 Feature Release" confirmed for May 2026'},
  {ts:'2026-05-07 16:45', product:'coreapi',    pname:'CoreAPI Gateway',    type:'risk',       msg:'New High risk added: "Design Freeze Delay" — score 9/10'},
  {ts:'2026-05-07 10:00', product:'datasphere', pname:'DataSphere',         type:'team',       msg:'2 Engineers added to DataSphere (FTE count: 20 → 22)'},
  {ts:'2026-05-06 15:20', product:'ehub',       pname:'EnterpriseHub',      type:'flag',       msg:'⚠ Ownership undefined flagged — PM role vacant since May 1'},
  {ts:'2026-05-06 09:10', product:'nexus',      pname:'Nexus Platform',     type:'roadmap',    msg:'"AI Feature Layer" initiative added to Later column'},
  {ts:'2026-05-05 17:00', product:'coreapi',    pname:'CoreAPI Gateway',    type:'risk',       msg:'Risk "Vendor API Deprecation" opened — Medium severity'},
  {ts:'2026-05-05 13:30', product:'datasphere', pname:'DataSphere',         type:'compliance', msg:'SOC 2 gap identified — remediation plan submitted to auditor'},
  {ts:'2026-05-04 11:00', product:'pulse',      pname:'Pulse Mobile',       type:'financial',  msg:'Forecast revised upward: $420K → $445K (scope change)'},
  {ts:'2026-05-03 09:45', product:'nexus',      pname:'Nexus Platform',     type:'team',       msg:'Felix Brand (Designer) moved from Pulse → Nexus at 60% allocation'},
  {ts:'2026-05-02 16:00', product:'ehub',       pname:'EnterpriseHub',      type:'roadmap',    msg:'Discovery phase started — 4 stakeholder workshops scheduled'},
  {ts:'2026-05-01 10:20', product:'datasphere', pname:'DataSphere',         type:'milestone',  msg:'DataSphere hit 91% completion — Scale phase officially confirmed'}
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function statusLabel(s){return{['on-track']:'On Track',['at-risk']:'At Risk',['delayed']:'Delayed'}[s]||s}
function statusColor(s){return{['on-track']:'#22c55e',['at-risk']:'#f59e0b',['delayed']:'#ef4444'}[s]||'#64748b'}
function statusBg(s){return{['on-track']:'#dcfce7',['at-risk']:'#fef9c3',['delayed']:'#fee2e2'}[s]||'#f1f5f9'}
function statusText(s){return{['on-track']:'#15803d',['at-risk']:'#854d0e',['delayed']:'#991b1b'}[s]||'#374151'}
function phaseBg(p){return{Discovery:'#ede9fe',Development:'#dbeafe',Launch:'#fef3c7',Scale:'#dcfce7'}[p]||'#f1f5f9'}
function phaseText(p){return{Discovery:'#6d28d9',Development:'#1d4ed8',Launch:'#92400e',Scale:'#15803d'}[p]||'#374151'}
function riskScoreColor(n){return n>=8?'#7f1d1d':n>=6?'#ef4444':n>=4?'#f59e0b':'#22c55e'}
function riskScoreBg(n){return n>=8?'#fee2e2':n>=6?'#fca5a5':n>=4?'#fef3c7':'#dcfce7'}
function sevColor(s){return{High:'#991b1b',Medium:'#92400e',Low:'#15803d'}[s]||'#374151'}
function sevBg(s){return{High:'#fee2e2',Medium:'#fef3c7',Low:'#dcfce7'}[s]||'#f1f5f9'}
function compIcon(s){return{pass:'✅',warn:'⚠️',fail:'❌'}[s]}
function compLabel(s){return{pass:'Compliant',warn:'Action Needed',fail:'Non-Compliant'}[s]}
function compColor(s){return{pass:'#15803d',warn:'#92400e',fail:'#991b1b'}[s]}
function allRisks(){return Object.values(RISKS).flat()}
function openRisks(){return allRisks().filter(r=>r.status!=='Closed')}
function totalFTE(){return PRODUCTS.reduce((a,p)=>a+p.fte,0)}
function getProduct(id){return PRODUCTS.find(p=>p.id===id)}

/* ── Persistence layer (localStorage) ───────────────────────────────────── */
const QX_STORAGE_KEY = 'qx_portal_v1';

function persistData(){
  try {
    localStorage.setItem(QX_STORAGE_KEY, JSON.stringify({ team:TEAM, risks:RISKS, roadmap:ROADMAP }));
  } catch(e){ console.warn('[Qorix] persistData failed:', e); }
}

(function _loadPersisted(){
  try {
    const saved = JSON.parse(localStorage.getItem(QX_STORAGE_KEY) || '{}');
    if(saved.team)    Object.keys(saved.team).forEach(k => { TEAM[k]    = saved.team[k]; });
    if(saved.risks)   Object.keys(saved.risks).forEach(k => { RISKS[k]  = saved.risks[k]; });
    if(saved.roadmap) Object.keys(saved.roadmap).forEach(k => { ROADMAP[k] = saved.roadmap[k]; });
  } catch(e){ console.warn('[Qorix] _loadPersisted failed:', e); }
})();

/* ── JIRA config helpers (per product) ─────────────────────────────────── */
function getJiraConfig(pid){
  try { return JSON.parse(localStorage.getItem('qx_jira_cfg_' + pid) || 'null'); }
  catch(e){ return null; }
}
function saveJiraConfig(pid, cfg){
  try { localStorage.setItem('qx_jira_cfg_' + pid, JSON.stringify(cfg)); }
  catch(e){ console.warn('[Qorix] saveJiraConfig failed:', e); }
}
function getJiraData(pid){
  try { return JSON.parse(localStorage.getItem('qx_jira_data_' + pid) || 'null'); }
  catch(e){ return null; }
}
function saveJiraData(pid, data){
  try { localStorage.setItem('qx_jira_data_' + pid, JSON.stringify(data)); }
  catch(e){ console.warn('[Qorix] saveJiraData failed:', e); }
}
function clearJiraData(pid){
  localStorage.removeItem('qx_jira_data_' + pid);
}

/* ── JIRA issue helpers ─────────────────────────────────────────────────── */
function jiraPriority(p){
  if(!p) return {label:'—',color:'#64748b',bg:'#f1f5f9'};
  const map = {
    Highest:{label:'Highest',color:'#7f1d1d',bg:'#fee2e2'},
    High:   {label:'High',   color:'#991b1b',bg:'#fee2e2'},
    Medium: {label:'Medium', color:'#92400e',bg:'#fef3c7'},
    Low:    {label:'Low',    color:'#15803d',bg:'#dcfce7'},
    Lowest: {label:'Lowest', color:'#15803d',bg:'#dcfce7'}
  };
  return map[p] || {label:p, color:'#64748b', bg:'#f1f5f9'};
}
function jiraStatusColor(cat){
  const map = {'To Do':'#64748b','In Progress':'#1d4ed8','Done':'#15803d','Closed':'#15803d'};
  return map[cat] || '#64748b';
}
function jiraStatusBg(cat){
  const map = {'To Do':'#f1f5f9','In Progress':'#dbeafe','Done':'#dcfce7','Closed':'#dcfce7'};
  return map[cat] || '#f1f5f9';
}
