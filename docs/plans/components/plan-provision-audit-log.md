# Provision Upgrade Plan: Audit Log

**Section ID:** `audit`
**API:** [`src/app/api/crm/status/route.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/app/api/crm/status/route.ts)
**Status:** 🔴 Not Started
**Priority:** P1 — Security & Compliance Provision

---

## Overview

The Audit Log provision surfaces the `AuditLog` Prisma model — a tamper-resistant record of all system actions: approvals, rejections, publishes, settings changes, login events, and API key operations.

---

## Upgrade Goals

- [ ] Paginated table of all audit events (newest first)
- [ ] Filter by: event type, user, date range, entity type
- [ ] Search by description keyword
- [ ] Expandable row showing full event payload (JSON diff)
- [ ] Event type colour codes (approve=green, reject=red, publish=blue, auth=purple)
- [ ] Export audit log to CSV (filtered or full)
- [ ] Retention policy display (how long logs are kept)
- [ ] Link from audit entry to the affected entity (draft, client, workflow)

---

## Audit Event Types

| Event | Triggered by |
|---|---|
| `draft.approved` | Approval Gate action |
| `draft.rejected` | Approval Gate action |
| `draft.published` | Publishing Service |
| `settings.changed` | Settings provision |
| `account.connected` | Social Accounts provision |
| `account.disconnected` | Social Accounts provision |
| `auth.login` | Login route |
| `auth.logout` | Logout route |
| `apikey.created` | Security settings |
| `apikey.revoked` | Security settings |
| `workflow.triggered` | Automation provision |

---

## Files Affected

| File | Change |
|---|---|
| `components/dashboard/AuditLogViewer.tsx` | New: full provision |
| `components/dashboard/AuditEventRow.tsx` | New: expandable row |
| `pages/api/audit.ts` | New: paginated audit log endpoint |
| [`src/generated/prisma/models/AuditLog.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/generated/prisma/models/AuditLog.ts) | Ensure all event types covered |

---

## Acceptance Criteria

- [ ] Full audit log renders with correct pagination (50 per page)
- [ ] Filter by date range returns accurate results
- [ ] Event payload expandable to show JSON diff
- [ ] CSV export includes all filtered records
- [ ] Audit entries link back to affected entity

---

## References

- [`src/generated/prisma/models/AuditLog.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/generated/prisma/models/AuditLog.ts)
- [`src/lib/security.ts`](file:///D:/citrixlabph/smma/nextjs-setup/nextjs-dashboard/src/lib/security.ts)
