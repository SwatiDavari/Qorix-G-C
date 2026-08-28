# Removal Impact Assessment — Section 1 items from the dead-code audit

Companion to `dead-code-audit-2026-07-16.md`. This evaluates: *if every item under that report's "Section 1 — what's actually dead" were deleted exactly as scoped, would the current working UI change, break, or need any other file updated?* No files were modified to produce this — verification was done by re-checking call sites, shared helpers, and CSS/stylesheet linkage that the original per-file audits didn't cross-reference.

**Bottom line:** most of the list (30 of 40 items) is genuinely zero-risk — delete and nothing else changes. Three items need to be scoped more narrowly than the original report implied, or they'd break a live feature. One item is directional — safe to remove from one file, breaking if removed from the other. Full detail below.

---

## Tier 1 — Zero risk: delete with no other change needed anywhere

These have no shared state, no shared DOM, and no other file depends on them. Verified via fresh call-site search, not just restating the original finding.

- **#1, #2** — dead `buildCard()` branches (dashboard.html). Deleting doesn't change what renders today; the earlier branch already produces every card.
- **#3** — `applyClassicGrcTheme()`'s unreachable `else`.
- **#4, #5** — `_renderJiraData()`'s dead body + `getNonComplianceItems`/`getTotalRiskItems`/`isOpenIssueStatus`. Re-verified: these three helpers have **no other caller anywhere** in product.html — the live GRC dashboard uses a completely different code path (`_grcNC`/`_grcRisks`, populated from `runDefectsJql`). Deleting the whole cluster together is clean.
- **#6** — `toggleJiraEdit()`.
- **#7** — Excel import modal. Re-verified this is fully self-contained: `#excel-overlay`/`.excel-modal` have their own dedicated CSS (product.html's own `<style>`, lines 84–86) and don't share any element with product.html's other (live) modal system (`openModal()`/`addMember()`). Nothing else references `#excel-overlay`. Safe to remove function, HTML, and CSS together.
- **#8, #9** — `exportTeam()`, `_getTodayJiraDate()`.
- **#10** — the five multi-product/multi-program JQL builder functions. **One nuance**: don't remove `_normalizeProgramFilter()` along with these — it's a shared helper also called by the two *live* single-product JQL functions (`_riskJqlForProductId`, `_nonComplianceJqlForProductId`). Only the five plural/multi-id functions listed are dead; the singular helpers and `_normalizeProgramFilter` must stay.
- **#11 through #14** — orphaned element ids and their dead lookup code.
- **#15** — `_grcData` global.
- **#16** — unused `defectsTotal`/`resolvedTotal` params. Technically zero risk either way — JS silently ignores extra arguments passed to a function that doesn't use them, so removing the params from the signature changes nothing for any caller. Truly optional.
- **#17** — `PAGE`/`MAX_PAGES` leftovers.
- **#18** — `TYPE_LABEL`.
- **#19, #20** — `allRisksFlat()`, dashboard.html's `sevBadge()`.
- **#21** — `renderActivity()`. Re-verified: `ACTIVITY` (the data.js array) has **no other consumer anywhere** once this function is gone — so deleting `renderActivity()` effectively makes `ACTIVITY` itself dead data too, not just dead code. Not a risk, just something to note if you also want to prune `ACTIVITY` from data.js later.
- **#22** — `syncAllJira()` and its two fetch calls.
- **#26** — `openR` variable.
- **#30 through #34** — the data.js cluster (`COMPLIANCE`, `compIcon/compLabel/compColor`, `askGap`, `PHASES`, `productAllocPct/productFTE/totalFTE`, `openRisks`/`allRisks`). Re-verified zero references in **either** HTML file for all of these.
- **#36 through #38** — the three unused server.js routes (`/api/jira/projects`, `GET /api/jira`, `/api/jira/issue`).
- **#40** — the two loose `JQL_*_SNIPPET.js` files. Confirmed via search: nothing `<script src>`'s or imports either one.

## Tier 2 — Needs correction: original scope was too broad, part of this cluster is live

- **#23, #28, #29 — dashboard.html's product modal.** This is the one real correction from the original report. `openProductModal()`, `updateProduct()`, and `riskScoreBadge()` (used only inside `openProductModal`'s template) **are** dead — confirmed no other caller. But the modal *shell* they populate — `#modal-overlay`, `#modal`, `#modal-title`, `#modal-body`, `.modal-hdr`, `.modal-close`, plus `closeModal()`/`closeModalDirect()`/`saveModal()` — is **shared** with `openNewProductModal()` ("+ Add Product"), which is very much live. Deleting the shell along with the dead edit-modal function would break the Add Product button entirely. **Correct scope: remove only `openProductModal()`, `updateProduct()`, `riskScoreBadge()`, and the dead `#np-*` input reading gap noted in #28 — do not touch the modal container markup, its CSS, or the close/save handlers.**
- **#24 — `renderJiraDashboard()` cluster.** Confirmed `PRODUCTS_NAMES` and `PRODUCTS_COLORS` are only used inside the two dead functions (`renderJiraDashboard`, `syncAllJira`) — safe to remove alongside them. But **`PRODUCTS_IDS` and `jiraDataFor()` must be kept** — both are used by the live `_loadDashboardJiraData()` (runs on page load) and by `liveRiskItemsForProduct()`/`liveTotalNonComplianceCount()`. Don't let a "remove all four `PRODUCTS_*` constants" sweep take out the two live ones by mistake.

## Tier 3 — Directional, not simply safe or unsafe

- **#35 — the shadowed Jira-storage functions.** `getJiraConfig`/`saveJiraConfig`/`getJiraData`/`saveJiraData` exist in both `assets/data.js` and `product.html`. **Removing product.html's copies is safe** — product.html loads data.js first via `<script src>`, and the two implementations are functionally identical (same localStorage keys, same behavior), so calls would silently fall through to data.js's versions with no change in behavior. **Removing data.js's copies would break dashboard.html immediately** (`ReferenceError: getJiraConfig is not defined`) — dashboard.html has no local copies of its own and depends entirely on data.js for these four functions. If you want to deduplicate, the direction matters: trim product.html, not data.js.

## Bonus finding — a real, pre-existing bug this check surfaced (not caused by any dead code)

While verifying Tier 2's modal-shell claim, I checked where the modal's CSS actually lives. It's defined in `assets/styles.css` (`.modal-overlay`, `.modal-overlay.open`, `.modal`, `.modal-hdr`, `.modal-close` — all fully styled there). `product.html` links that stylesheet (`<link rel="stylesheet" href="assets/styles.css"/>`), but **`dashboard.html` does not** — it only pulls in the Google Fonts link and its own two inline `<style>` blocks, neither of which contains any modal rules. That means the "Add New Product" modal in `dashboard.html` — a live, actively-called feature, not dead code — likely renders with no positioning/overlay/close-button styling at all today, independent of anything in the dead-code report. Worth knowing before you touch this modal for any reason, since its current "live" status doesn't mean it currently looks correct to a user.

## Direct answer to "if Section 1 is removed, will there be any impact on current working UI"

For 30 of the 40 items: no impact — they don't render anything, aren't called, and nothing else references them today. Deleting them changes zero pixels and zero behavior.

For the 3 items in Tier 2 (#23/#28/#29, #24): impact only if removed at the scope the original report implied (whole modal, whole `PRODUCTS_*` set) — scoped correctly per the notes above, still zero UI impact.

For #35 (Tier 3): zero impact if trimmed from product.html; breaks dashboard.html entirely if trimmed from data.js instead.

None of the 40 items, removed at the precise scope described above, would change what a user currently sees or can do — because by definition nothing currently reachable depends on any of them. The one thing actually worth fixing for the *current* UI is the unrelated stylesheet-linking gap in dashboard.html noted above, which affects a live feature today regardless of any cleanup decision.
