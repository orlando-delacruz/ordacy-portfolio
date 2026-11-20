# Phase 04 — Contact and email

**Goal:** the contact form creates a real inquiry row and emails the owner through
EmailJS. The inquiry is saved before the email is attempted; an email failure never
loses a lead or shows the visitor an error.

**Prerequisites:** Phase 03 committed (admin can read the Inquiries page).

## Owner setup checklist

- [ ] Create an EmailJS account (free: 200 emails/month, no card).
- [ ] Email Services → connect your Gmail (or Outlook) account; note the **Service ID**.
- [ ] Email Templates → new template. Recipient: your email. Variables:
  `{{name}}`, `{{email}}`, `{{business}}`, `{{service}}`, `{{plan}}`,
  `{{message}}`, `{{launch_date}}`, `{{submitted_at}}`. Note the **Template ID**.
- [ ] Account → copy the **Public Key** and **Private Key**.
- [ ] Add `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`,
  `EMAILJS_PRIVATE_KEY` to Vercel env vars and `.env.local`.
- [ ] Send one test inquiry after the code lands and mark it “not spam” once.

## Steps

- [ ] **1. Write `api/inquiries.ts`** (POST only; `Cache-Control: no-store`).
  - Validate: `name` 2–120 chars, `email` valid and ≤ 200 chars, `message` 10–5000
    chars, optional fields length-capped; reject with `400` and a field list.
  - Honeypot: a hidden `website` field; when filled, respond `201` and do nothing.
  - Throttle: SHA-256 of the client IP with a server salt; more than 3 inquiries from
    the same hash in 15 minutes → `429`.
  - Insert the inquiry (`status: 'new'`, ISO `submittedAt`, nulls for empty optional
    fields).
  - Then call EmailJS REST (`https://api.emailjs.com/api/v1.0/email/send`) with the
    service/template/public/private IDs and the template variables. Wrap in
    try/catch; log failures with the inquiry id; respond `201` either way.
  - Any other method → `405`.

- [ ] **2. Client submission.** `submitInquiry` in `src/services/index.ts` becomes a
  `POST /api/inquiries` with the existing input mapping. The form keeps its spinner,
  success panel, compact failure panel, retained values, and focus behavior from the
  state system — no UI changes beyond the hidden honeypot field in `ContactForm.tsx`
  (`tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`, visually hidden).

- [ ] **3. Tests** (`tests/`), extending the phase 03 suite:
  - payload validation accepts/rejects the documented cases;
  - honeypot short-circuits before any insert;
  - throttle counts within the window;
  - save-before-email order: a throwing email sender still produces `201` and a saved
    row (inject the sender).

## Verification

- [ ] Real submission from `/contact` at 320 and 768: success panel, row in admin
  Inquiries, email in the inbox.
- [ ] Temporarily force the EmailJS call to throw: visitor still sees success, the
  inquiry is in admin, and the failure is logged server-side.
- [ ] Fill the honeypot (devtools): `201`, no row, no email.
- [ ] Submit four times quickly: the fourth returns `429`, and the form shows its
  existing error state with retained values.
- [ ] `?state=success` / `?state=error` previews unchanged.
- [ ] Four checks + `npm test` pass.
- [ ] No EmailJS private key in `dist/` (`grep -r EMAILJS_PRIVATE dist/` empty).

## Checkpoint (owner)

Send a real inquiry from your phone: it arrives by email and appears in admin. Reply in
your head — this is the production path now.

## Review criteria

Validation and throttle are server-side; honeypot is invisible to real users and
assistive tech; email failure cannot fail the visitor's submission; no secrets client-
side; the existing form states are untouched.

## Commit

`feat: deliver inquiries to the database and by email`
