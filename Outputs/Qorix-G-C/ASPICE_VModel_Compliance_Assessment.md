# ASPICE V-Model Compliance Assessment — Qorix-G-C

**Date:** 2026-07-23
**Scope:** (1) the Qorix-G-C repository itself (the product-status dashboard), and (2) the live Jira instance (qorix.atlassian.net) it reports on, covering the six tracked product lines — Classic (CP), Adaptive (AP), Bootloader (QB), Developer (QD), Performance (QP), Classic Lite (QCL).
**Criterion:** presence of a traceable V-model cycle — requirements → architecture/design → construction → verification (unit/integration) → qualification/validation — as required by Automotive SPICE.

## Verdict

**Not compliant.** No product line has an end-to-end, traceable V-model in Jira or in the repo. Support processes (defect, deviation, change, retrospective) are active and well used; the two processes that anchor a V-cycle — **requirements management** and **verification/review** — have no work-item representation anywhere in the Jira instance, and the one project set up to hold formal V&V test records is empty.

## V-Model Stage Findings

| V-model stage | ASPICE process | Expected work product | Evidence found | Status |
|---|---|---|---|---|
| Requirements | SYS.2 / SWE.1 | Baselined, approved requirement items | Issue type `Requirement` does not exist in any of the 27 Jira projects (0 hits org-wide). `Feature`/`Story` are used instead but carry no approval/baseline workflow. | **Missing** |
| System/SW Architecture | SYS.3 / SWE.2 | Reviewed architecture docs | One doc exists for the dashboard itself (`PROJECT_DIVISION_APPROACH.md`), a proposed target architecture — not yet implemented, no equivalent exists for the 6 products. | **Missing (products) / Planned-only (repo)** |
| Detailed Design & Construction | SWE.3 | Design records, coding standard | `Feature`/`Story`/`Task` issues exist (3,607 Features across the 6 products) but with no linked requirement or design record to trace to. | **Partial (untraceable)** |
| Unit Verification | SWE.4 | Review records, unit test results | Issue type `Review` does not exist anywhere (0 hits). `QTM Unit Test` type exists only in project **TMS – "Qorix Test Management System PoC"**, with **0 issues created**. | **Missing** |
| SW/System Integration Test | SWE.5 / SYS.4 | Integration test records | `QTM Integration Test` / `QTM System Integration Test` types exist only in TMS (PoC), 0 issues. | **Missing** |
| SW/System Qualification Test | SWE.6 / SYS.5 | Qualification test records, release sign-off | `QTM Qualification Test` / `QTM System Qualification Test` exist only in TMS, 0 issues. `Release Readiness Review (RRR)` type exists only in **QD** and **FD** projects (4 issues total) — not used by Classic, Adaptive, Bootloader, Performance, or Classic Lite. | **Missing for 5 of 6 products** |
| Problem Resolution | SUP.9 | Defect/deviation records | `Bug` (873) and `Problem`/`Deviation` (1,309) actively used across all 6 products. | **In place** |
| Change Request Mgmt | SUP.10 | Change request records | `Change Request` type exists; only **7** issues across the 6 product projects combined, plus 11 in a dedicated `QCCB` project — low, inconsistent adoption. | **Weak / partial** |
| Process Audit / Non‑Compliance | SUP.1 / assessment | Audit finding records | Issue type `AuditFinding` (referenced in the dashboard's own query definitions) does not exist. A separate `Non-Compliance` type exists in project `QGC` with 69 issues — real gap-tracking exists, just under a different name/location than the dashboard's code assumes. | **Present but misconfigured** |
| Continuous Improvement | PA / retrospectives | Retrospective records | `Retrospective` type actively used (580 issues). | **In place** |

## Repo-level findings (Qorix-G-C itself)

The dashboard's own codebase shows the same pattern as the products it reports on:

- No requirements, architecture, or test documentation in the repo. `Outputs/Qorix-G-C/PROJECT_DIVISION_APPROACH.md` is a proposed refactor plan, not yet built — the actual repo is still the flat, monolithic structure the doc describes as the "current state" to be replaced.
- No test folder, test framework, or CI test step. `.github/workflows/static.yml` only deploys static files to GitHub Pages; it does not build or test anything.
- No README at the repo root.
- Git history shows no branching/review discipline: single active branch, no tags/releases, and commit messages showing repeated churn (`Create static.yml` / `Delete .github/workflows directory` repeated 4×, `Update greeting from 'Hello World' to 'Goodbye World'`, `Delete Test Bot`) mixed into the same history as feature work.
- `data.js` hard-codes `TEST_JQL` queries against issue types (`Requirement`, `Review`, `AuditFinding`) that don't exist in the connected Jira — so the dashboard's own "Requirements"/"Reviews"/"Compliance" panels would return empty results even when pointed at real data, independent of whether Jira credentials are filled in.
- Two product lines the dashboard is meant to track — **OS Porting** and **Process Definition** — have `null` Jira project keys in `JIRA_CFG`, i.e., no work products of any kind are wired up for them.

## Gaps to close for V-model / ASPICE compliance

1. Create and adopt a `Requirement` issue type (or equivalent) with an approval/baseline workflow, in every product project — currently zero traceable requirements exist.
2. Introduce a review/verification record (peer review, unit test result) per product — the `Review` type doesn't exist, and the only unit/integration/qualification test schema (in `TMS`) has never been used.
3. Extend `Release Readiness Review` (or an equivalent qualification gate) to Classic, Adaptive, Bootloader, Performance, and Classic Lite — today only Developer and the demo project have one.
4. Reconcile the dashboard's `TEST_JQL` definitions (`Requirement`, `Review`, `AuditFinding`) with what actually exists in Jira (`Non-Compliance` in `QGC`, not `AuditFinding` in each product) so the compliance panel reflects real data.
5. Wire up Jira project keys for OS Porting and Process Definition, or explicitly document them as out of scope.
6. Increase Change Request usage/consistency across product projects (currently 7 records total across 6 products).
7. For the repo itself: add a requirements/architecture doc for the *current* implementation (not just the proposed refactor), add automated tests to the CI workflow, and adopt branch/PR review discipline.

*Note: this assessment is based on issue-type presence and counts, not on reading individual ticket content — it establishes whether the process infrastructure for a V-cycle exists and is used, not whether existing Feature/Story content is technically sound.*
