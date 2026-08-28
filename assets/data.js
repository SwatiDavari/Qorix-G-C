/* ─── Qorix Product Management — Data Layer v2 ──────────────────────────── */

/* ── JIRA Configuration ───────────────────────────────────────────────────
   Fill in JIRA_EMAIL and JIRA_TOKEN before use.
   The proxy server (node server.js) must be running at localhost:3000.
─────────────────────────────────────────────────────────────────────────── */
const JIRA_CFG = {
  domain : 'qorix.atlassian.net',
  email  : '',     // ← replace with your Atlassian email
  token  : '',      // ← replace with your Atlassian API token
  projects: {
    classic    : 'CP',
    adaptive   : 'AP',
    bootloader : 'QB',
    developer  : 'QD',
    osporting  : null,
    performance: 'QP',
    lightweight: 'QCL',
    processdef : null,
    test       : 'CP'
  }
};

/* ── Qorix Test — JQL definitions ──────────────────────────────────────────
   Single source of truth for every JQL shown against Qorix Test — used by
   both the dashboard card (dashboard.html buildCard) and the JQL breakdown
   cards on the product detail page (product.html renderTestJqlCards).
   Do not duplicate these strings elsewhere; reference TEST_JQL instead.

   Project Key : CP  (JIRA_CFG.projects.test, above)
   Program     : Classic (PROGRAM_NAMES.test, below — reuses Qorix Classic's
                 real Program tag so Risk/Non-Compliance JQLs return data)
─────────────────────────────────────────────────────────────────────────── */
const TEST_JQL = {
  openBugs:               `project = CP AND issuetype = Bug AND status not in (Closed, Done)`,
  criticalBugs:           `project = CP AND issuetype = Bug AND Severity = Critical AND status not in (Closed)`,
  requirementsTotal:      `project = CP AND issuetype = Requirement`,
  requirementsNotApproved:`project = CP AND issuetype = Requirement AND status != Approved`,
  auditFindings:          `project = CP AND issuetype = AuditFinding AND status != Closed`,
  reviews:                `project = CP AND issuetype = Review`,
  impediments:            `project = CP AND Flagged = Impediment`,
  reopenedBugs:           `project = CP AND issuetype = Bug AND status IN ("Reopened") ORDER BY priority DESC, created DESC`,
  changeRequests:         `project = CP AND issuetype = "Change Request"`
};

/* ── Qorix Test — Top 3 Upcoming Releases (project CP) ────────────────────
   Pulled from CP's real Jira Releases page (115 releases total), nearest 3
   by release date. Every date below is verified against Jira, along with
   real total/open issue counts per version. As of this snapshot (14 Jul
   2026) all three release dates have already passed while the versions are
   still marked unreleased in Jira — so Status is honestly "Delayed" rather
   than invented On Track / At Risk values. Re-verify via live JIRA sync
   before relying on this for reporting; update syncedAt when refreshed.

   OWNERSHIP: this block is Qorix Test's own data ONLY. Qorix Classic has its
   own separate CLASSIC_RELEASES* constants directly below, even though both
   currently mirror the same real project-CP snapshot (Test's JIRA project is
   CP itself, reused as its sandbox). Keeping them as two distinct constants
   — not one shared reference — means removing either product from the
   codebase can't silently break the other's release card. If you update one
   snapshot from a real Jira sync, check whether the other needs the same
   update too; they are not automatically kept in sync with each other. */
const TEST_RELEASES = [
  { name:'Fee bugfix release',   releaseDate:'2026-06-10', totalIssues:6, openIssues:0, progress:100,
    jiraUrl:'https://qorix.atlassian.net/issues?jql=project%20%3D%20CP%20AND%20fixVersion%20%3D%20%22Internal%7C0.3.0%7Cdevelopement%7CClassic%7CR24-11%20Bugfix%20Release%3A%20Fee%22' },
  { name:'Nm bugfix release',    releaseDate:'2026-06-15', totalIssues:2, openIssues:0, progress:100,
    jiraUrl:'https://qorix.atlassian.net/issues?jql=project%20%3D%20CP%20AND%20fixVersion%20%3D%20%22Internal%7C1.3.0%7CDevelopment%7CClassic%7CR24-11%20Bugfix%20Release%3A%20Nm%22' },
  { name:'CanNm bugfix release', releaseDate:'2026-06-19', totalIssues:3, openIssues:2, progress:33,
    jiraUrl:'https://qorix.atlassian.net/issues?jql=project%20%3D%20CP%20AND%20fixVersion%20%3D%20%22Internal%7C0.5.1%7Cdevelopment%7CClassic%7CBugfix%20Release%3A%20CanNm%22' }
];
const TEST_RELEASES_SYNCED_AT = '2026-07-14';
/* Count of UNRELEASED releases as shown on CP's native Jira Releases page
   ("This space has 115 releases", filtered to Unreleased). This is scoped to
   unreleased only — not the project's total release count including released
   ones. No Jira API tool here can list project versions in bulk (only issue
   search), so this figure is taken directly from the Jira UI rather than
   computed — update it if the Releases page count changes. */
const TEST_RELEASES_UNRELEASED_COUNT = 115;

/* ── Qorix Classic — Top 3 Upcoming Releases (project CP) ─────────────────
   Classic's OWN static release fallback, used by product.html's GRC
   dashboard release card and dashboard.html's product card, whenever a live
   JIRA sync hasn't been run yet. Deliberately a separate constant from
   TEST_RELEASES above (see the ownership note there) so Classic keeps
   working unmodified if Qorix Test is ever removed from the codebase.
   Values below are identical to TEST_RELEASES as of this snapshot because
   both point at the same real Jira project (CP) — update independently. */
const CLASSIC_RELEASES = [
  { name:'Fee bugfix release',   releaseDate:'2026-06-10', totalIssues:6, openIssues:0, progress:100,
    jiraUrl:'https://qorix.atlassian.net/issues?jql=project%20%3D%20CP%20AND%20fixVersion%20%3D%20%22Internal%7C0.3.0%7Cdevelopement%7CClassic%7CR24-11%20Bugfix%20Release%3A%20Fee%22' },
  { name:'Nm bugfix release',    releaseDate:'2026-06-15', totalIssues:2, openIssues:0, progress:100,
    jiraUrl:'https://qorix.atlassian.net/issues?jql=project%20%3D%20CP%20AND%20fixVersion%20%3D%20%22Internal%7C1.3.0%7CDevelopment%7CClassic%7CR24-11%20Bugfix%20Release%3A%20Nm%22' },
  { name:'CanNm bugfix release', releaseDate:'2026-06-19', totalIssues:3, openIssues:2, progress:33,
    jiraUrl:'https://qorix.atlassian.net/issues?jql=project%20%3D%20CP%20AND%20fixVersion%20%3D%20%22Internal%7C0.5.1%7Cdevelopment%7CClassic%7CBugfix%20Release%3A%20CanNm%22' }
];
const CLASSIC_RELEASES_SYNCED_AT = '2026-07-14';
const CLASSIC_RELEASES_UNRELEASED_COUNT = 115;

/* ── Program Names for Risk & Non-Compliance Issues ───────────────────────────
   Maps product ID → Program name (as stored in JIRA custom field)
─────────────────────────────────────────────────────────────────────────── */
const PROGRAM_NAMES = {
  classic: 'Classic',
  adaptive: 'Adaptive',
  bootloader: 'Bootloader',
  developer: 'Qorix Developer',
  /* Qorix Test is a sandbox product with no Program of its own — it intentionally
     points at Qorix Classic's real project (CP) and Program ('Classic') so its
     JQLs return real, non-empty data instead of querying an empty Program. */
  test: 'Classic',
  performance: 'Performance'
};

/* ── Reverse lookup: Program name → Product ID ──────────────────────────────── */
const PROGRAM_TO_PRODUCT = {
  'Classic': 'classic',
  'Adaptive': 'adaptive',
  'Bootloader': 'bootloader',
  'Qorix Developer': 'developer',
  'Performance': 'performance'
};

const QX = {
  blue:'#3C00FF', cyan:'#00FFFF', lime:'#D7FF3C', navy:'#0E2841',
  steel:'#156082', sky:'#0F9ED5', orange:'#E97132', green:'#4EA72E',
  purple:'#A02B93', gray:'#E8E8E8', red:'#ef4444'
};

/* ── Helper Function: Get Today's Date ──────────────────────────────────── */
const getToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* ── 7 Products ─────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id:'classic',    name:'Qorix Classic',           abbr:'QC', color:'#3C00FF',
    tagline:'Flagship embedded platform — stable & production-proven',
    pm:'Prashant Patil',       pmInitials:'AR', status:'on-track', phase:'Development',
    completion:65,  budget:950,  actual:618,  forecast:920,  fteCost:340, fte:20,
    updated:getToday(),
    /*description:'Flagship embedded software platform — stable, production-proven across automotive and industrial verticals. v4.1 in active development targeting Q3 2026 GA.',*/
    tags:['Embedded','Automotive','Production','Stable'] },

  { id:'adaptive',   name:'Qorix Adaptive',          abbr:'QA', color:'#0F9ED5',
    tagline:'Self-tuning runtime for dynamic workloads',
    pm:'Philipp Meyer',         pmInitials:'JL', status:'at-risk',  phase:'Development',
    completion:42,  budget:520,  actual:310,  forecast:575,  fteCost:220, fte:13,
    updated:getToday(),
    /*description:'Self-tuning adaptive runtime layer for dynamic workload management. Behind schedule — algorithm complexity higher than estimated. Stakeholder review May 20.',*/
    tags:['Adaptive','Runtime','Dynamic','ML'] },

  { id:'bootloader', name:'Qorix Bootloader',         abbr:'QB', color:'#E97132',
    tagline:'Secure OTA-capable bootloader for embedded targets',
    pm:'Paula Herzog',         pmInitials:'PN', status:'on-track', phase:'POC',
    completion:28,  budget:280,  actual:78,   forecast:295,  fteCost:95,  fte:6,
    updated:getToday(),
    /*description:'Secure, OTA-capable bootloader for resource-constrained embedded targets. POC validating cryptographic chain-of-trust on ARM Cortex-M platforms.',*/
    tags:['Bootloader','Security','OTA','ARM'] },

  { id:'developer',  name:'Qorix Developer',          abbr:'QD', color:'#4EA72E',
    tagline:'SDK, toolchain & developer experience layer',
    pm:'Suresh Chamuah',        pmInitials:'MW', status:'delayed',  phase:'Development',
    completion:38,  budget:380,  actual:195,  forecast:430,  fteCost:148, fte:10,
    updated:getToday(),
    /*description:'SDK, toolchain and developer experience layer for the Qorix ecosystem. CLI tool and IDE plugin in development. Delayed by dependency on design freeze.',*/
    tags:['SDK','Toolchain','Developer','IDE'] },

  { id:'performance',name:'Qorix Performance',        abbr:'QP', color:'#A02B93',
    tagline:'Real-time performance profiling & tuning engine',
    pm:'Lars Bauhofer',         pmInitials:'SC', status:'on-track', phase:'Assessment',
    completion:15,  budget:160,  actual:24,   forecast:175,  fteCost:48,  fte:3,
    updated:getToday(),
    /*description:'Real-time performance profiling and tuning engine. Business case under assessment. Benchmarking against 3 competing solutions.',*/
    tags:['Performance','Profiling','Real-time','Analysis'] },

  { id:'lightweight', name:'Qorix Light weight',      abbr:'QL', color:'#156082',
    tagline:'Ultra-minimal build for MCU-class targets',
    pm:'Prashant Patil',           pmInitials:'RI', status:'at-risk',  phase:'POC',
    completion:55,  budget:240,  actual:132,  forecast:268,  fteCost:98,  fte:7,
    updated:getToday(),
    /*description:'Ultra-minimal Qorix build for MCU-class devices (<256KB flash). POC on STM32 series. Memory optimisation proving harder than estimated.',*/
    tags:['Lightweight','MCU','Minimal','STM32'] },

  { id:'test',        name:'Qorix Test',               abbr:'QT', color:'#0D9488',
    tagline:'Test product — sandbox for portal validation',
    pm:'Test User',                pmInitials:'TU', status:'on-track', phase:'POC',
    completion:10,  budget:100,  actual:10,   forecast:100,  fteCost:20,  fte:2,
    updated:getToday(),
    tags:['Test','Sandbox'],
    /* Live JIRA snapshot from project CP (last synced manually — run "Sync JIRA"
       once JIRA_CFG.email/token are filled in to refresh automatically) */
    jira:{
      openBugs:363, criticalBugs:0, impediments:1, changeRequests:3,
      requirementsTotal:0, requirementsNotApproved:0, auditFindings:0,
      reviews:0, reopenedBugs:0, syncedAt:getToday()
    } },

  
];

/* ── Team  (allocation = actual %, askAllocation = requested %) ─────────── */
const TEAM = {
  classic: [
    {name:'Shubham Borude', initials:'SB', role:'Quality Manager',   type:'quality-consultant', allocation:50, askAllocation:50, shared:false},
    {name:'Chetan Baragi',  initials:'CB', role:'Safety Manager',    type:'safety-manager',     allocation:50, askAllocation:50, shared:false},
    {name:'Karthik Vanka',  initials:'KV', role:'Security Manager',  type:'security-manager',   allocation:30, askAllocation:30, shared:true}
  ],
  adaptive: [
    {name:'Kavitha KG',     initials:'KK', role:'Quality Consultant',type:'quality-consultant', allocation:50, askAllocation:50, shared:true},
    {name:'Nikita Nakhade', initials:'NN', role:'Safety Manager',    type:'safety-manager',     allocation:0, askAllocation:50, shared:false, status:'On ML till Dec 2026'}
  ],
  bootloader: [
    {name:'Kavitha KG',     initials:'KK', role:'Quality Consultant',type:'quality-consultant', allocation:25, askAllocation:25, shared:true},
    {name:'Rakshith CS',    initials:'RC', role:'Safety Manager',    type:'safety-manager',     allocation:50, askAllocation:50, shared:false}
  ],
  developer: [
    {name:'Kavitha KG',     initials:'KK', role:'Quality Consultant',type:'quality-consultant', allocation:25, askAllocation:25, shared:true},
    {name:'Chetan Baragi',  initials:'CB', role:'Safety Manager',    type:'safety-manager',     allocation:25, askAllocation:25, shared:true}
  ],
  performance: [
    {name:'Volker HS',      initials:'VH', role:'Quality Consultant',type:'quality-consultant', allocation:50, askAllocation:50, shared:true},
    {name:'Volker HS',      initials:'VH', role:'Safety Manager',    type:'safety-manager',     allocation:50, askAllocation:50, shared:true},
    {name:'Karthik Vanka',  initials:'KV', role:'Security Manager',  type:'security-manager',   allocation:60, askAllocation:60, shared:true}
  ],
  lightweight: [],
  test: [
    {name:'Test Member', initials:'TM', role:'Quality Consultant', type:'quality-consultant', allocation:50, askAllocation:50, shared:false}
  ]
};

/* ── Roadmap ─────────────────────────────────────────────────────────────── */
const ROADMAP = {
  classic:[
    {col:'now',  type:'milestone',title:'v4.1 Feature Freeze',    desc:'Auth redesign + CAN stack updates',     dep:null,           date:'May 2026'},
    {col:'now',  type:'init',     title:'Hardware Regression Suite',desc:'Full CI on target hardware',          dep:null,           date:'May 2026'},
    {col:'now',  type:'dep',      title:'Compliance Sign-off',     desc:'ISO 26262 review required',            dep:'Legal/Safety', date:'Jun 2026'},
    {col:'next', type:'init',     title:'Multi-ECU Support',       desc:'Extend to 3-ECU configurations',       dep:null,           date:'Jul 2026'},
    {col:'next', type:'milestone',title:'v4.1 GA Release',         desc:'Production release to all customers',  dep:null,           date:'Aug 2026'},
    {col:'later',type:'init',     title:'Over-the-Air Update',     desc:'OTA delta updates via Bootloader',     dep:'Bootloader',   date:'Q4 2026'},
    {col:'later',type:'milestone',title:'v5.0 Architecture',       desc:'Full AUTOSAR migration',               dep:'Infra',        date:'Q1 2027'}
  ],
  adaptive:[
    {col:'now',  type:'milestone',title:'Algorithm Prototype',     desc:'Self-tuning ML model v0.2',            dep:null,           date:'May 2026'},
    {col:'now',  type:'dep',      title:'Stakeholder Review',      desc:'⚠ Go/no-go decision May 20',           dep:'Leadership',   date:'May 2026'},
    {col:'next', type:'init',     title:'Runtime Integration',     desc:'Embed adaptive layer in Classic',      dep:'Classic team', date:'Jul 2026'},
    {col:'next', type:'milestone',title:'Alpha Release',           desc:'Internal early-access build',          dep:null,           date:'Sep 2026'},
    {col:'later',type:'milestone','title':'GA Launch',             desc:'Full product launch',                  dep:null,           date:'Q1 2027'}
  ],
  bootloader:[
    {col:'now',  type:'init',     title:'Chain-of-Trust POC',     desc:'Cortex-M cryptographic signing',        dep:null,           date:'May 2026'},
    {col:'now',  type:'dep',      title:'HSM Vendor Selection',   desc:'Evaluating 3 hardware security modules',dep:'Procurement',  date:'Jun 2026'},
    {col:'next', type:'milestone',title:'POC Complete',           desc:'Decision: proceed to Development?',     dep:null,           date:'Jul 2026'},
    {col:'next', type:'init',     title:'OTA Delta Engine',       desc:'Minimal footprint patch mechanism',     dep:null,           date:'Aug 2026'},
    {col:'later',type:'milestone',title:'v1.0 Release',           desc:'Production-ready bootloader',           dep:null,           date:'Q4 2026'}
  ],
  developer:[
    {col:'now',  type:'milestone',title:'CLI v0.1 Alpha',         desc:'Basic build/flash/debug commands',      dep:null,           date:'May 2026'},
    {col:'now',  type:'dep',      title:'API Design Freeze',      desc:'⚠ Blocked on CoreAPI dependency',       dep:'CoreAPI team', date:'Jun 2026'},
    {col:'next', type:'init',     title:'VS Code Extension',      desc:'Syntax, IntelliSense, debug adapter',   dep:null,           date:'Aug 2026'},
    {col:'next', type:'milestone',title:'SDK Beta',               desc:'Open beta for partner developers',      dep:null,           date:'Sep 2026'},
    {col:'later',type:'milestone',title:'1.0 GA',                 desc:'Full developer toolkit release',        dep:null,           date:'Q1 2027'}
  ],
  performance:[
    {col:'now',  type:'init',     title:'Competitive Analysis',   desc:'Benchmark vs Percepio, SEGGER',         dep:null,           date:'May 2026'},
    {col:'now',  type:'milestone','title':'Business Case',        desc:'Investment decision by leadership',      dep:'Leadership',   date:'Jun 2026'},
    {col:'next', type:'init',     title:'Architecture Proposal',  desc:'Pending assessment approval',           dep:null,           date:'Jul 2026'},
    {col:'later',type:'milestone',title:'POC Start',              desc:'If assessment approved',                dep:null,           date:'Q4 2026'}
  ],
  lightweight:[
    {col:'now',  type:'init',     title:'STM32 Memory Opt.',      desc:'RAM/flash reduction experiments',       dep:null,           date:'May 2026'},
    {col:'now',  type:'dep',      title:'Toolchain Support',      desc:'Needs Developer SDK integration',       dep:'Developer',    date:'Jun 2026'},
    {col:'next', type:'milestone',title:'Sub-256KB Build',        desc:'Target: <256KB flash footprint',        dep:null,           date:'Jul 2026'},
    {col:'next', type:'init',     title:'Nordic nRF Port',        desc:'Extend to nRF52 series',                dep:null,           date:'Aug 2026'},
    {col:'later',type:'milestone',title:'POC Complete',           desc:'Decision: productise or pivot',         dep:null,           date:'Q4 2026'}
  ],
  processdef:[
    {col:'now',  type:'milestone',title:'PM Assignment',          desc:'⚠ No PM — blocked',                    dep:'Leadership',   date:'May 2026'},
    {col:'now',  type:'init',     title:'Scope Definition',       desc:'What is this product?',                 dep:null,           date:'Jun 2026'},
    {col:'next', type:'init',     title:'Stakeholder Interviews', desc:'Pending PM assignment',                 dep:null,           date:'Jul 2026'},
    {col:'later',type:'milestone',title:'Assessment Complete',    desc:'Pending all prior steps',               dep:null,           date:'Q3 2026'}
  ],
  
};

/* ── Risks ───────────────────────────────────────────────────────────────── */
const RISKS = {
  classic:[], adaptive:[], bootloader:[], developer:[], performance:[], lightweight:[]
};

/* ── Compliance ──────────────────────────────────────────────────────────── */
const COMPLIANCE = {
  classic:[], adaptive:[], bootloader:[], developer:[], performance:[], lightweight:[]
};

/* ── Activity log ────────────────────────────────────────────────────────── */
const ACTIVITY = [
  {ts:'2026-05-08 15:10', product:'lightweight', pname:'Qorix Light weight',        type:'risk',      msg:'Risk "Memory Target May Slip" escalated to High severity'},
  {ts:'2026-05-08 11:30', product:'classic',     pname:'Qorix Classic',             type:'roadmap',   msg:'Milestone "v4.1 Feature Freeze" confirmed for May 2026'},
  {ts:'2026-05-07 16:00', product:'adaptive',    pname:'Qorix Adaptive',            type:'flag',      msg:'⚠ Go/no-go stakeholder review scheduled for May 20'},
  {ts:'2026-05-07 10:45', product:'developer',   pname:'Qorix Developer',           type:'risk',      msg:'API Design Freeze Delay escalated to CTO'},
  {ts:'2026-05-06 14:20', product:'processdef',  pname:'Qorix Process Definition',  type:'flag',      msg:'⚠ No PM assigned — product blocked at Assessment stage'},
  {ts:'2026-05-06 09:00', product:'bootloader',  pname:'Qorix Bootloader',          type:'roadmap',   msg:'HSM vendor evaluation started (3 candidates)'},
  {ts:'2026-05-05 17:30', product:'developer',   pname:'Qorix Developer',           type:'roadmap',   msg:'CLI v0.1 Alpha internal build distributed to team'},
  {ts:'2026-05-05 13:00', product:'classic',     pname:'Qorix Classic',             type:'team',      msg:'2 new engineers onboarded to Classic team (FTE: 18→20)'},
  {ts:'2026-05-04 11:00', product:'performance', pname:'Qorix Performance',         type:'risk',      msg:'Business Case risk opened — approval pending leadership'},
  {ts:'2026-05-04 09:30', product:'adaptive',    pname:'Qorix Adaptive',            type:'financial', msg:'Forecast revised upward $520K → $575K (scope change)'},
  {ts:'2026-05-03 16:00', product:'processdef',  pname:'Qorix Process Definition',  type:'risk',      msg:'Two High risks logged — scope undefined + no PM'},
  {ts:'2026-05-02 10:00', product:'lightweight', pname:'Qorix Light weight',        type:'roadmap',   msg:'POC scope locked: STM32L476 primary target confirmed'}
];

/* ── Helper functions ────────────────────────────────────────────────────── */
function statusLabel(s){return{['on-track']:'On Track',['at-risk']:'At Risk',['delayed']:'Delayed'}[s]||s}
function statusColor(s){return{['on-track']:'#22c55e',['at-risk']:'#f59e0b',['delayed']:'#ef4444'}[s]||'#64748b'}
function phaseBg(p){return{Development:'#dbeafe',POC:'#ede9fe',Assessment:'#fef3c7'}[p]||'#f1f5f9'}
function phaseText(p){return{Development:'#1d4ed8',POC:'#6d28d9',Assessment:'#92400e'}[p]||'#374151'}
function riskScoreColor(n){return n>=8?'#7f1d1d':n>=6?'#ef4444':n>=4?'#f59e0b':'#22c55e'}
function sevBg(s){return{High:'#fee2e2',Medium:'#fef3c7',Low:'#dcfce7'}[s]||'#f1f5f9'}
function sevColor(s){return{High:'#991b1b',Medium:'#92400e',Low:'#15803d'}[s]||'#374151'}
function getProduct(id){return PRODUCTS.find(p=>p.id===id)}

/* ── Persistence layer ───────────────────────────────────────────────────── */
const QX_KEY = 'qx_portal_v2';

function persistData(){
  try{ localStorage.setItem(QX_KEY, JSON.stringify({team:TEAM,risks:RISKS,roadmap:ROADMAP,compliance:COMPLIANCE})); }
  catch(e){ console.warn('[Qorix] persist failed',e); }
}

(function _load(){
  try{
    const d = JSON.parse(localStorage.getItem(QX_KEY)||'{}');
    if(d.team)       Object.keys(d.team).forEach(k=>{ TEAM[k]=d.team[k]; });
    if(d.risks)      Object.keys(d.risks).forEach(k=>{ RISKS[k]=d.risks[k]; });
    if(d.roadmap)    Object.keys(d.roadmap).forEach(k=>{ ROADMAP[k]=d.roadmap[k]; });
    if(d.compliance) Object.keys(d.compliance).forEach(k=>{ COMPLIANCE[k]=d.compliance[k]; });
  }catch(e){ console.warn('[Qorix] load failed',e); }
})();

/* ── JIRA helpers ────────────────────────────────────────────────────────── */
function getJiraConfig(pid){ try{return JSON.parse(localStorage.getItem('qx_jira_cfg_'+pid)||'null');}catch(e){return null;} }
function saveJiraConfig(pid,cfg){ try{localStorage.setItem('qx_jira_cfg_'+pid,JSON.stringify(cfg));}catch(e){} }
function getJiraData(pid){ try{return JSON.parse(localStorage.getItem('qx_jira_data_'+pid)||'null');}catch(e){return null;} }
function saveJiraData(pid,data){ try{localStorage.setItem('qx_jira_data_'+pid,JSON.stringify(data));}catch(e){} }
function clearJiraData(pid){ localStorage.removeItem('qx_jira_data_'+pid); }
function jiraPriority(p){ const m={Highest:{label:'Highest',color:'#7f1d1d',bg:'#fee2e2'},High:{label:'High',color:'#991b1b',bg:'#fee2e2'},Medium:{label:'Medium',color:'#92400e',bg:'#fef3c7'},Low:{label:'Low',color:'#15803d',bg:'#dcfce7'},Lowest:{label:'Lowest',color:'#15803d',bg:'#dcfce7'}}; return m[p]||{label:p||'—',color:'#64748b',bg:'#f1f5f9'}; }
function jiraStatusColor(c){ return{'To Do':'#64748b','In Progress':'#1d4ed8','Done':'#15803d'}[c]||'#64748b'; }
function jiraStatusBg(c){ return{'To Do':'#f1f5f9','In Progress':'#dbeafe','Done':'#dcfce7'}[c]||'#f1f5f9'; }
