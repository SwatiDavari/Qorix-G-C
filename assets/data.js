/* ─── Qorix Product Management — Data Layer v2 ──────────────────────────── */

/* ── JIRA Configuration ───────────────────────────────────────────────────
   Fill in JIRA_EMAIL and JIRA_TOKEN before use.
   The proxy server (node server.js) must be running at localhost:3000.
─────────────────────────────────────────────────────────────────────────── */
const JIRA_CFG = {
  domain : 'qorix.atlassian.net',
  email  : 'YOUR_EMAIL@qorix.com',     // ← replace with your Atlassian email
  token  : 'YOUR_JIRA_API_TOKEN',      // ← replace with your Atlassian API token
  projects: {
    classic    : 'CP',
    adaptive   : 'AP',
    bootloader : 'QB',
    developer  : 'QD',
    osporting  : null,
    performance: null,
    lightweight: null,
    processdef : null
  }
};

const QX = {
  blue:'#3C00FF', cyan:'#00FFFF', lime:'#D7FF3C', navy:'#0E2841',
  steel:'#156082', sky:'#0F9ED5', orange:'#E97132', green:'#4EA72E',
  purple:'#A02B93', gray:'#E8E8E8', red:'#ef4444'
};

const PHASES = ['Development','POC','Assessment'];

/* ── 7 Products ─────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id:'classic',    name:'Qorix Classic',           abbr:'QC', color:'#3C00FF',
    tagline:'Flagship embedded platform — stable & production-proven',
    pm:'Aisha Rahman',       pmInitials:'AR', status:'on-track', phase:'Development',
    completion:65,  budget:950,  actual:618,  forecast:920,  fteCost:340, fte:20,
    revenue:'$2.8M', mrr:'$233K', users:'18,400', adoption:'72%', nps:74, churn:'1.8%',
    updated:'2026-05-08',
    description:'Flagship embedded software platform — stable, production-proven across automotive and industrial verticals. v4.1 in active development targeting Q3 2026 GA.',
    tags:['Embedded','Automotive','Production','Stable'] },

  { id:'adaptive',   name:'Qorix Adaptive',          abbr:'QA', color:'#0F9ED5',
    tagline:'Self-tuning runtime for dynamic workloads',
    pm:'Jordan Lee',         pmInitials:'JL', status:'at-risk',  phase:'Development',
    completion:42,  budget:520,  actual:310,  forecast:575,  fteCost:220, fte:13,
    revenue:'$640K', mrr:'$53K', users:'4,200', adoption:'38%', nps:52, churn:'5.2%',
    updated:'2026-05-07',
    description:'Self-tuning adaptive runtime layer for dynamic workload management. Behind schedule — algorithm complexity higher than estimated. Stakeholder review May 20.',
    tags:['Adaptive','Runtime','Dynamic','ML'] },

  { id:'bootloader', name:'Qorix Bootloader',         abbr:'QB', color:'#E97132',
    tagline:'Secure OTA-capable bootloader for embedded targets',
    pm:'Priya Nair',         pmInitials:'PN', status:'on-track', phase:'POC',
    completion:28,  budget:280,  actual:78,   forecast:295,  fteCost:95,  fte:6,
    revenue:'—', mrr:'—', users:'—', adoption:'—', nps:'—', churn:'—',
    updated:'2026-05-06',
    description:'Secure, OTA-capable bootloader for resource-constrained embedded targets. POC validating cryptographic chain-of-trust on ARM Cortex-M platforms.',
    tags:['Bootloader','Security','OTA','ARM'] },

  { id:'developer',  name:'Qorix Developer',          abbr:'QD', color:'#4EA72E',
    tagline:'SDK, toolchain & developer experience layer',
    pm:'Marcus Webb',        pmInitials:'MW', status:'delayed',  phase:'Development',
    completion:38,  budget:380,  actual:195,  forecast:430,  fteCost:148, fte:10,
    revenue:'$310K', mrr:'$26K', users:'2,100', adoption:'22%', nps:44, churn:'6.8%',
    updated:'2026-05-05',
    description:'SDK, toolchain and developer experience layer for the Qorix ecosystem. CLI tool and IDE plugin in development. Delayed by dependency on design freeze.',
    tags:['SDK','Toolchain','Developer','IDE'] },

  { id:'performance',name:'Qorix Performance',        abbr:'QP', color:'#A02B93',
    tagline:'Real-time performance profiling & tuning engine',
    pm:'Sofia Chen',         pmInitials:'SC', status:'on-track', phase:'Assessment',
    completion:15,  budget:160,  actual:24,   forecast:175,  fteCost:48,  fte:3,
    revenue:'—', mrr:'—', users:'—', adoption:'—', nps:'—', churn:'—',
    updated:'2026-05-04',
    description:'Real-time performance profiling and tuning engine. Business case under assessment. Benchmarking against 3 competing solutions.',
    tags:['Performance','Profiling','Real-time','Analysis'] },

  { id:'lightweight', name:'Qorix Light weight',      abbr:'QL', color:'#156082',
    tagline:'Ultra-minimal build for MCU-class targets',
    pm:'Raj Iyer',           pmInitials:'RI', status:'at-risk',  phase:'POC',
    completion:55,  budget:240,  actual:132,  forecast:268,  fteCost:98,  fte:7,
    revenue:'—', mrr:'—', users:'—', adoption:'—', nps:'—', churn:'—',
    updated:'2026-05-08',
    description:'Ultra-minimal Qorix build for MCU-class devices (<256KB flash). POC on STM32 series. Memory optimisation proving harder than estimated.',
    tags:['Lightweight','MCU','Minimal','STM32'] },

  { id:'processdef', name:'Qorix Process Definition', abbr:'PD', color:'#ef4444',
    tagline:'Process modelling & lifecycle governance layer',
    pm:'— Unassigned —',    pmInitials:'??', status:'at-risk',  phase:'Assessment',
    completion:8,   budget:120,  actual:10,   forecast:140,  fteCost:20,  fte:2,
    revenue:'—', mrr:'—', users:'—', adoption:'—', nps:'—', churn:'—',
    updated:'2026-05-03',
    description:'Process modelling and lifecycle governance layer. Assessment stage — no PM assigned. Scope and ownership undefined.',
    tags:['Process','Governance','Lifecycle','Assessment'] },

  {
    id:'osporting', name:'Qorix OS Porting', abbr:'OP', tagline:'Embedded OS abstraction and porting layer',
    color:'#0891b2', status:'on-track', phase:'POC', completion:15,
    pm:'TBD', pmInitials:'TB', tags:['OS','Porting','Embedded'],
    desc:'OS porting layer providing POSIX and AUTOSAR abstraction for Qorix platform targets.',
    users:'—', adoption:'—', nps:0, mrr:'—',
    budget:0, actual:0, forecast:0, fteCost:0, fte:0,
    updated:'2026-05-09'
  }
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
    {name:'Nikita Nakhade', initials:'NN', role:'Safety Manager',    type:'safety-manager',     allocation:50, askAllocation:50, shared:false}
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
  osporting:   [],
  lightweight: [],
  processdef:  []
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
  osporting:[]
};

/* ── Risks ───────────────────────────────────────────────────────────────── */
const RISKS = {
  classic:[], adaptive:[], bootloader:[], developer:[], performance:[], lightweight:[], processdef:[], osporting:[]
};

/* ── Compliance ──────────────────────────────────────────────────────────── */
const COMPLIANCE = {
  classic:[], adaptive:[], bootloader:[], developer:[], performance:[], lightweight:[], processdef:[], osporting:[]
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
function compIcon(s){return{pass:'✅',warn:'⚠️',fail:'❌'}[s]}
function compLabel(s){return{pass:'Compliant',warn:'Action Needed',fail:'Non-Compliant'}[s]}
function compColor(s){return{pass:'#15803d',warn:'#92400e',fail:'#991b1b'}[s]}
function allRisks(){return Object.values(RISKS).flat()}
function openRisks(){return allRisks().filter(r=>r.status!=='Closed')}
function totalFTE(){return Object.values(TEAM).reduce((s,arr)=>s+arr.length,0)}
function productFTE(id){return (TEAM[id]||[]).length}
function productAllocPct(id){const m=TEAM[id]||[];return m.length?Math.round(m.reduce((s,x)=>s+(x.allocation||0),0)/m.length):0}
function getProduct(id){return PRODUCTS.find(p=>p.id===id)}
function askGap(m){return (m.askAllocation||0)-(m.allocation||0)}

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
