# Qorix Portal — Dead Code Audit

**Date:** 2026-07-16
**Scope:** `product.html`, `dashboard.html`, `assets/data.js`, `assets/styles.css` (not deeply audited — CSS unused-selector analysis is noisy and lower value), `server.js`, `index.html`, plus the two loose root-level files `JQL_CODE_SNIPPET.js` and `JQL_PROGRAM_CODE_SNIPPET.js`.
**Method:** Full read-through of every file (not sampling), cross-referencing every function/constant/element `id` against its call sites. Evaluation only — **no files were modified** as part of this audit.

Confidence key: **Certain** = verified no call site exists anywhere in scope. **Likely** = strong evidence, minor chance of an external caller outside scope. **Worth double-checking** = a real observation but with some ambiguity in interpretation.

---

## 1. Summary — what's actually dead

| # | Item | File | Why dead | Confidence |
|---|------|------|----------|------------|
| 1 | `if(['adaptive','bootloader','developer','performance','lightweight'].includes(p.id))` branch, `buildCard()` | dashboard.html:1068–1113 | Earlier branch at line 905 already matches the same product IDs and returns first | Certain |
| 2 | "Original gradient card" branch, `buildCard()` | dashboard.html:1115–1140 | Every id in today's `PRODUCTS` array is already claimed by an earlier branch | Likely (dead given current data, structurally reachable if a new product id were added) |
| 3 | `else` branch of `applyClassicGrcTheme()` | product.html:1445–1448 | An earlier identical-condition check (line 1439) already guarantees this branch's condition is true, given the function's own early-return at line 1416 | Certain |
| 4 | Most of `_renderJiraData()` body | product.html:3481–3492 (plus local helpers 3431–3470) | Guard at 3480 always returns true — the three target element ids (`jira-defects-list`, `jira-nc-list`, `jira-risk-list`) don't exist anywhere in the current HTML | Certain |
| 5 | `getNonComplianceItems`, `getTotalRiskItems`, `isOpenIssueStatus` | product.html:2243, 2249, 2259 | Only called from the dead code in #4 | Certain |
| 6 | `toggleJiraEdit()` | product.html:3260–3269 | No caller; targets ids (`jira-edit-panel`, `jira-edit-toggle`) that don't exist | Certain |
| 7 | Excel import modal subsystem (`openExcelImport` + ~9 dependent functions + ~60 lines of modal HTML) | product.html:2789–2963, HTML 815–875 | `openExcelImport()`, the only way to open the modal, is never called | Certain (entry point) / Likely (whole subsystem) |
| 8 | `exportTeam()` | product.html:2775 | Export button calls `exportProduct()` directly instead | Certain |
| 9 | `_getTodayJiraDate()` | product.html:3143–3149 | No call site | Certain |
| 10 | `_riskJqlForPrograms`, `_riskJqlForProductIds`, `_nonComplianceJqlForPrograms`, `_nonComplianceJqlForProductIds`, `_getProgramNamesForProducts` | product.html:3029–3108 | Multi-product JQL builder chain; only the single-product siblings are actually used elsewhere | Certain |
| 11 | `#classic-allocation-slot` | product.html:454 | No `getElementById` call anywhere | Certain |
| 12 | `grc-defect-trend-sub` lookup | product.html:1605 | id doesn't exist in HTML — a computed caption is never shown | Certain |
| 13 | `grc-releases-total` lookup, `.grc-do-sub` inside releases section | product.html:1337, 1341 | Neither id/selector exists in the releases card markup | Certain |
| 14 | `grc-incident-highest/-high/-medium` lookups + their bucket computation | product.html:3317–3326 | ids don't exist (only `grc-incident-total` does) | Certain |
| 15 | `_grcData` (implicit global) | product.html:3283 | Assigned, never read elsewhere | Certain |
| 16 | `defectsTotal`/`resolvedTotal` params of `_syncGrcFromJiraDefects` | product.html:3282 | Passed in by every caller, never read inside the function body | Likely |
| 17 | `PAGE`, `MAX_PAGES` in `runDefectsJql()` | product.html:3513, 3515 | Leftover from a superseded client-side pagination approach (backend now handles it via `fetchAll`) | Certain |
| 18 | `TYPE_LABEL` | product.html:2362 | Declared alongside `TC`/`TYPE_BG`/`TYPE_TXT` (all used); this one has no other reference | Certain |
| 19 | `allRisksFlat()` | dashboard.html:619 | No call site | Certain |
| 20 | `sevBadge()` (dashboard.html's own copy) | dashboard.html:775 | No call site (other badge helpers are all used) | Certain |
| 21 | `renderActivity()` + `#activity-filter`/`#timeline-container` | dashboard.html:1491–1508 | No call site; targets ids that don't exist — would throw if it ever ran | Certain |
| 22 | `syncAllJira(btn)` + its two `/api/jira/search` fetch calls | dashboard.html:1731–1777 | No `onclick` or programmatic call anywhere | Certain |
| 23 | `openProductModal(id)` + the entire "Add/Edit Product" modal (`updateProduct`, modal HTML inputs, `riskScoreBadge` at 776) | dashboard.html:1513–1556, 1574, 776 | Never invoked — product cards navigate to `product.html` instead; cascades to everything only reachable through it | Certain (entry point) / Likely (cascade) |
| 24 | `renderJiraDashboard()` body past its guard, `jiraCfgFor()`, `PRODUCTS_NAMES`, `PRODUCTS_COLORS` | dashboard.html:1668–1729, 1658, 1655–1656 | Called, but immediately returns — `#jira-dashboard-strip` doesn't exist in this file's HTML | Certain (guard) / Likely (the two constants) |
| 25 | `COMPLIANCE_FLAGS` | dashboard.html:678–683 | No reference anywhere | Certain |
| 26 | `openR` variable in `renderKPIs()` | dashboard.html:1466 | Assigned, never read (code uses `totalR` instead) | Certain |
| 27 | `id="modal"`, `id="section-tabbar"` | dashboard.html:600, 375 | Never queried by JS | Certain |
| 28 | `#np-name`, `#np-pm`, `#np-status`, `#np-phase`, `#np-fte` (Add Product form inputs) | dashboard.html:1564–1568 | Never read by `saveModal()` — typed input is discarded on Save | Certain |
| 29 | Modal CSS classes (`.modal`, `.modal-overlay`, `.modal-hdr`, `.modal-close`) | dashboard.html (HTML ~599–608, no matching `<style>` rules) | No CSS rules exist for these classes anywhere in the file's two `<style>` blocks | Worth double-checking |
| 30 | `compIcon()`, `compLabel()`, `compColor()`, the `COMPLIANCE` object | assets/data.js:297–299, 325–327 | Zero references in either HTML file (confirmed via full-text search of both) | Certain |
| 31 | `askGap()` | assets/data.js:334 | Zero references in either HTML file | Certain |
| 32 | `PHASES` | assets/data.js:129 | Zero references in either HTML file | Certain |
| 33 | `productAllocPct()`, `productFTE()`, `totalFTE()` | assets/data.js:330–332 | Zero references in either HTML file | Certain |
| 34 | `openRisks()`, and transitively `allRisks()` | assets/data.js:328–329 | `openRisks()` has zero references; `allRisks()`'s only caller is `openRisks()` | Certain |
| 35 | `getJiraConfig`, `saveJiraConfig`, `getJiraData`, `saveJiraData` (data.js versions) | assets/data.js:355–358 | Shadowed inside product.html, which redeclares identical-purpose functions locally (confirmed functionally equivalent, just re-implemented) — **dead specifically in product.html's context**, but still the live versions for dashboard.html, which does not redeclare them | Certain |
| 36 | `POST /api/jira/projects` | server.js:239 | Never called from either HTML file | Certain |
| 37 | `GET /api/jira` (labeled "legacy compatibility wrapper" in its own comment) | server.js:296 | Never called | Certain |
| 38 | `POST /api/jira/issue` | server.js:322 | Never called | Certain |
| 39 | `GET /api/dashboard` (labeled "GRC stub" returning fabricated mock issues) | server.js:354 | Never called by either HTML file — but worth flagging as a landmine: it exists and returns entirely fake data, so anyone wiring it up later assuming it's real would silently get mock issues instead of live Jira data | Certain (unused today) |
| 40 | `JQL_CODE_SNIPPET.js`, `JQL_PROGRAM_CODE_SNIPPET.js` (whole files) | repo root | Not referenced by any `<script src>` or import anywhere — draft/reference snippets, not part of the running app. `PROGRAM_NAMES`/`PROGRAM_TO_PRODUCT` from the second file *were* successfully copy-pasted into `assets/data.js` and are live; the multi-project JQL functions from the first file appear to be the source of item #10 above (copy-pasted into product.html but never wired up) | Certain (files themselves are orphaned) |

**`index.html`**: reviewed in full (28 lines) — a simple redirect page. No dead code found.

---

## 2. Not dead — duplication worth flagging separately

These execute fine today; they're not bugs, just repeated logic that could be consolidated if you ever want to reduce maintenance surface. Listed for completeness per the audit brief, not as something broken.

- **`renderTestReleases()`** (product.html:1123–1175) and **`renderGrcReleases()`** (product.html:1322–1413) — near-identical release-row rendering logic duplicated for two different table targets.
- **`dedupeIssues`/`uniqueByKey`** — the same dedup-by-key logic is reimplemented three separate times across product.html (`_renderJiraData`'s local copy — itself dead, see #4; `grcRenderIncidentsSummary`'s local copy; and the top-level `uniqueByKey` used by `runDefectsJql`).
- **`grcLoad()`'s `.grc-classic`/`.grc-synced` class toggles** (product.html ~1279–1280) use the exact same 6-product condition for both classes, so they always co-occur — the CSS distinction between the two rulesets never actually differentiates any product from another. May be intentional layering rather than a bug — worth a second look if you're ever cleaning up that CSS.
- **`getJiraConfig`/`saveJiraConfig`/`getJiraData`/`saveJiraData`** — see item #35 above; product.html's local copies are functionally identical to data.js's shared versions.

## 3. Not dead, but backed by permanently-empty static data (data-completeness gap, not a code bug)

- `assets/data.js`'s `RISKS` object (line 292–294) is `{classic:[], adaptive:[], ...}` for every product — always empty. Two *live* functions depend on it: `liveRiskItemsForProduct()` in dashboard.html (falls back to `RISKS[pid]` only when no live JIRA cache exists — the fallback always yields `[]`, which is an honest empty state, not fabricated data) and `exportReport()`'s CSV "Open Risks" column (dashboard.html:1642, always exports `0` for this column). Not dead code — both functions run and are called — just worth knowing the static fallback path can never produce a non-zero number.

---

## 4. Suggested priority if you want to act on any of this later

(No action taken — this section is informational only, per your instruction not to change anything.)

- **Highest value / lowest risk to remove:** items #19–28 (dashboard.html's entire dead "Add/Edit Product modal" subsystem, `renderActivity`, `syncAllJira`, `allRisksFlat`, `sevBadge`) — large, self-contained, clearly superseded by direct navigation to `product.html`.
- **Also self-contained:** product.html's Excel-import modal (#7) and the multi-product JQL builder chain (#10).
- **Needs a decision first:** whether `server.js`'s `/api/dashboard` mock endpoint (#39) should be deleted outright (since it could mislead a future maintainer) or kept as a documented stub.
- **Cosmetic only, near-zero risk:** unused constants/variables (#15, #16, #17, #18, #26, #30–34).
- **Structural, needs more thought:** the data.js/product.html function-shadowing case (#35) — consolidating would mean either removing product.html's local copies (relying on data.js) or removing data.js's copies (breaking dashboard.html unless it's updated too).
