# Provision Upgrade Plan: Automation

**Section ID:** `automation`
**API:** [`src/app/api/automation/route.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/app/api/automation/route.ts)
**Backend:** [`src/smm/workflows/daily.py`](file:///D:/citrixlabph/smma/src/smm/workflows/daily.py), [`src/smm/schedules/cron.py`](file:///D:/citrixlabph/smma/src/smm/schedules/cron.py)
**Status:** 🔴 Not Started
**Priority:** P1 — Workflow Automation Provision

---

## Overview

The Automation provision manages background workflows and scheduled jobs. It visualises the `Workflow` model instances, cron jobs from `schedules/cron.py`, and publish workers from `publishing/worker.ts`.

---

## Upgrade Goals

- [ ] List all active/paused `Workflow` records with run history
- [ ] Manual trigger button per workflow ("Run now")
- [ ] Cron schedule display (human-readable: "Every day at 9am")
- [ ] Last run status and duration per workflow
- [ ] Error log viewer for failed workflow runs
- [ ] Pause / resume / delete workflow actions
- [ ] Create new workflow from template (daily plan, weekly report, etc.)
- [ ] Publish worker status panel (queue depth, processing rate)
- [ ] `POST /api/workflow/run` integration for manual trigger

---

## Files Affected

| File | Change |
|---|---|
| `components/dashboard/AutomationHub.tsx` | New: full provision |
| `components/dashboard/WorkflowCard.tsx` | New: per-workflow card |
| `components/dashboard/CronScheduleDisplay.tsx` | New: human-readable cron |
| [`src/app/api/automation/route.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/app/api/automation/route.ts) | Add list, trigger, pause endpoints |
| [`src/smm/workflows/daily.py`](file:///D:/citrixlabph/smma/src/smm/workflows/daily.py) | Expose run status |
| [`src/smm/schedules/cron.py`](file:///D:/citrixlabph/smma/src/smm/schedules/cron.py) | Add list/status endpoint |

---

## Acceptance Criteria

- [ ] All workflows listed with status (active/paused/failed)
- [ ] Manual trigger fires within 2 seconds and shows progress
- [ ] Cron schedules displayed in plain language
- [ ] Error logs paginated, searchable
- [ ] Pause/resume persists across server restart

---

## References

- [`src/smm/workflows/daily.py`](file:///D:/citrixlabph/smma/src/smm/workflows/daily.py)
- [`src/smm/schedules/cron.py`](file:///D:/citrixlabph/smma/src/smm/schedules/cron.py)
- [`src/generated/prisma/models/Workflow.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/generated/prisma/models/Workflow.ts)
- [`src/generated/prisma/models/PublishJob.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/generated/prisma/models/PublishJob.ts)
