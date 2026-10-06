# Admin web UI polish — design brief (Architect)

**Stack:** Next.js admin (`Focus-Tag-Admin-Dashboard`). Same Supabase as FocusTag.  
**Hard rule:** QR payload stays **`focustag://tag/{uid}`** (parity with NFC → `tap_focus`). Do not ship opaque `QR-…` as the student-facing payload.

## Roles (gate nav + actions)

| Role | Sees | Can |
|------|------|-----|
| `admin` | Full dashboard | Locations, NFC/QR tags, classes, enroll, promote/demote teachers, policies if UI exists |
| `teacher` | Classes they’re assigned + roster/sessions | Read roster/live status; **no** tag registry / promote / institution settings |
| other | `/unauthorized` | — |

Middleware already role-gates; polish must not weaken RLS — UI hides what RPCs already forbid.

## Information architecture

Keep routes; modernize chrome only:
- `/login` → `/dashboard` (overview KPIs: active sessions, tags, classes)
- **People:** Students (search/assign), Teachers (promote/demote)
- **Space:** Locations → NFC tags (register UID, activate) → **QR modal** encodes `focustag://tag/{uid}` + copy/download
- **Classes:** list → detail (enroll students, assign teachers)
- Optional later: class policy editor (BLOCK/ALLOW/PROTECTED + version) — E MVP

Nav: left rail or top tabs by role; institution name in header; clear role badge.

## Visual / UX (modern, dense, calm)

- Neutral surface + one accent; 8px grid; card lists with search/filter
- Tables: sticky header, empty states with one primary CTA
- Destructive actions: confirm dialog (demote, deactivate tag/location)
- Toast on RPC success/fail (humanize Supabase errors)
- Mobile: collapsible nav; QR modal full-width with large code

## QR / NFC (non-negotiable)

1. Register/show **NFC UID** as source of truth  
2. “Show QR” → encode **`focustag://tag/{that_uid}`** only  
3. Copy link + download PNG; optional print sheet  
4. If `qr_credentials` table remains, treat as admin audit — **student scan path ignores opaque tokens** unless explicitly resolved to UID then `tap_focus`

## Out of scope

Device Owner, IoT firmware UI, redesign of student Android app, new auth providers.

## Acceptance

Admin can: create location → register tag UID → open QR showing `focustag://tag/{uid}` → create class on location → enroll student → promote teacher. Teacher login cannot reach tag/promote screens.
