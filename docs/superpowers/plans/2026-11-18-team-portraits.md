# Team Portraits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the remote placeholder avatars for Orlando Dela Cruz and Darcy Tabafunda with approved real portraits, using the white-background photo in light theme and the dark-background photo in dark theme.

**Architecture:** Four pre-sized JPEGs live in `public/images/team/` and are referenced from `data/database/team.json`. `TeamAvatar` gains an optional `darkSrc`, and one helper selects the path from the active site theme so the Home team strip and the team profile strip/lightbox cannot drift. The admin team form gains an optional dark-photo field. The storage prefix stays `ordacy-cms:v2:`; old saved records without `darkSrc` fall back to the light photo.

**Tech Stack:** React 19, TypeScript 6, styled-components 6, Vite 8, Vite public assets, PowerShell + System.Drawing for the one-off image resize, browser-local data via `@/data`.

**Spec:** No separate spec exists. The owner's answers from this session are captured verbatim in Global Constraints.

## Global Constraints

- Scope is team portraits only: Home team strip, team profile avatar strip and its lightbox, and the team profile OG image. Do not change the Home hero profile avatar (`ordacy-avatar*.png`), the team hero cover art (`ProfileCoverArt`), or any headline/copy.
- `avatar.src` is the white-background photo; `avatar.darkSrc` is the dark-background photo. Social preview (`og:image`) keeps using `avatar.src`.
- Resize every portrait to 1024×1024 JPEG quality 85. Keep the full supplied half-body framing; do not crop or retouch faces.
- Keep the storage prefix `ordacy-cms:v2:` in `src/data/storage.ts`. `darkSrc` is optional and falls back to `src`, so no browser-local admin edits or inquiries are discarded.
- Alt text is exactly `Orlando Dela Cruz, Founder and Software Engineer` and `Darcy Tabafunda, Secretary`. The word "Placeholder" must not remain.
- No new dependencies, no test runner, no new theme tokens, no hardcoded colors, no inline style objects. Spacing/fixed sizes stay on the 4/8-point grid.
- Do not commit, stage, or discard anything. The project requires explicit approval for Git writes.
- Keep the page-header and section-heading system untouched.

## Review Focus

- A team record already saved in this browser before this change has no `darkSrc`; in dark theme it must show the white photo, not a broken image or a 404.
- A member with `avatar: null` must keep the initials fallback in both themes.
- Toggling the theme while a profile or its lightbox is open must switch the photo without a reload or a stale image.
- Entering a dark-photo URL in admin without a main photo URL must produce a validation error, not an orphan path saved invisibly.
- Both asset paths must return 200 in the built preview; a missing file would only surface as a broken avatar.

---

### Task 1: Prepare the four portrait files

**Files:**
- Create: `public/images/team/orlando-dela-cruz.jpg`
- Create: `public/images/team/orlando-dela-cruz-dark.jpg`
- Create: `public/images/team/darcy-tabafunda.jpg`
- Create: `public/images/team/darcy-tabafunda-dark.jpg`
- Source: `C:\Users\SSD-ORLANDO\Pictures\Ordacy\orlando-white.png`, `orlando-dark.png`, `darcy-white.png`, `darcy-dark.png` (1254×1254 PNG, 1.46–1.81 MB; leave the originals untouched)

**Interfaces:**
- Produces: four public paths consumed by `data/database/team.json` in Task 2: `/images/team/orlando-dela-cruz.jpg`, `/images/team/orlando-dela-cruz-dark.jpg`, `/images/team/darcy-tabafunda.jpg`, `/images/team/darcy-tabafunda-dark.jpg`.

- [ ] **Step 1: Create the team image folder and convert all four files in one run**

Run this from the project root (`System.Drawing` is already available in this shell):

```powershell
New-Item -ItemType Directory -Force public/images/team | Out-Null
Add-Type -AssemblyName System.Drawing
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]85)
$map = @{
  'orlando-white.png' = 'public/images/team/orlando-dela-cruz.jpg'
  'orlando-dark.png'  = 'public/images/team/orlando-dela-cruz-dark.jpg'
  'darcy-white.png'   = 'public/images/team/darcy-tabafunda.jpg'
  'darcy-dark.png'    = 'public/images/team/darcy-tabafunda-dark.jpg'
}
foreach ($entry in $map.GetEnumerator()) {
  $source = [System.Drawing.Image]::FromFile("C:\Users\SSD-ORLANDO\Pictures\Ordacy\$($entry.Key)")
  $canvas = New-Object System.Drawing.Bitmap(1024, 1024)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.DrawImage($source, 0, 0, 1024, 1024)
  $canvas.Save((Join-Path (Get-Location) $entry.Value), $jpeg, $encoderParams)
  $graphics.Dispose(); $canvas.Dispose(); $source.Dispose()
  "wrote $($entry.Value)"
}
```

- [ ] **Step 2: Verify dimensions and weight**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem public/images/team/*.jpg | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  "{0}: {1}x{2}, {3:N0} KB" -f $_.Name, $img.Width, $img.Height, ($_.Length / 1KB)
  $img.Dispose()
}
```

Expected: all four are `1024x1024`; each is comfortably under 300 KB; no PNGs in that folder.

- [ ] **Step 3: Spot-check one file visually**

Open `public/images/team/darcy-tabafunda.jpg` and confirm it is the white-background portrait with the full half-body framing, not the dark one and not cropped.

### Task 2: Add `darkSrc` to the data model and seed records

**Files:**
- Modify: `src/data/types.ts:236-239`
- Modify: `data/database/team.json:8-11` and `:73-76`

**Interfaces:**
- Produces: `TeamAvatar = { src: string; darkSrc?: string; alt: string }`, consumed by Tasks 3 and 4.
- Produces: `/images/team/...` paths above, consumed by the components in Task 3.

- [ ] **Step 1: Extend the type**

In `src/data/types.ts`, change `TeamAvatar` to:

```ts
export type TeamAvatar = {
  src: string
  /** Dark-theme photo; falls back to `src` when absent (older saved records). */
  darkSrc?: string
  alt: string
}
```

- [ ] **Step 2: Replace Orlando's avatar block**

In `data/database/team.json`, replace:

```json
"avatar": {
  "src": "https://i.pravatar.cc/512?img=12",
  "alt": "Placeholder portrait for Orlando Dela Cruz"
},
```

with:

```json
"avatar": {
  "src": "/images/team/orlando-dela-cruz.jpg",
  "darkSrc": "/images/team/orlando-dela-cruz-dark.jpg",
  "alt": "Orlando Dela Cruz, Founder and Software Engineer"
},
```

- [ ] **Step 3: Replace Darcy's avatar block**

In `data/database/team.json`, replace:

```json
"avatar": {
  "src": "https://i.pravatar.cc/512?img=32",
  "alt": "Placeholder portrait for Darcy Tabafunda"
},
```

with:

```json
"avatar": {
  "src": "/images/team/darcy-tabafunda.jpg",
  "darkSrc": "/images/team/darcy-tabafunda-dark.jpg",
  "alt": "Darcy Tabafunda, Secretary"
},
```

- [ ] **Step 4: Confirm no placeholder portraits remain**

Run: `Select-String -Path data/database/team.json -Pattern "pravatar|Placeholder portrait"`

Expected: no output. Run `npm run typecheck`; expected: pass (the JSON is cast to `TeamMemberRecord[]`, so this mainly guards the type edit).

### Task 3: Select the photo by site theme

**Files:**
- Create: `src/features/team/avatar.ts`
- Modify: `src/features/team/components/TeamStrip.tsx:2-3, 31-37`
- Modify: `src/features/team/sections/TeamHero.tsx:1-9, 26-28, 58-70, 104-113`
- Unchanged by design: `src/features/team/TeamMemberPage.tsx:22` keeps `ogImage: member.avatar?.src` (light photo).

**Interfaces:**
- Consumes: `TeamAvatar` from Task 2; `useAppTheme()` returns `{ theme: 'light' | 'dark' }`; `TeamMember['avatar']` is `TeamAvatar | null`.
- Produces: `teamAvatarSrc(avatar: TeamMember['avatar'], theme: ThemeName): string | undefined` — `undefined` only when `avatar` is null; otherwise `darkSrc` when `theme === 'dark'` and it exists, else `src`.

- [ ] **Step 1: Create the helper**

Create `src/features/team/avatar.ts`:

```ts
import type { TeamMember } from '@/data'
import type { ThemeName } from '@/styles/theme'

/** Theme-appropriate profile photo; older records without darkSrc use src. */
export function teamAvatarSrc(
  avatar: TeamMember['avatar'],
  theme: ThemeName,
): string | undefined {
  if (!avatar) return undefined
  return theme === 'dark' && avatar.darkSrc ? avatar.darkSrc : avatar.src
}
```

- [ ] **Step 2: Use it in the Home team strip**

In `TeamStrip.tsx`, add `import { useAppTheme } from '@/app/theme-context'` and import `teamAvatarSrc` from `../avatar`, call `const { theme } = useAppTheme()` once at the top of the component, then inside the `team.map` callback replace the `member.avatar ?` condition and image with:

```tsx
const avatarSrc = teamAvatarSrc(member.avatar, theme)
```

```tsx
{avatarSrc ? (
  <S.AvatarImage
    src={avatarSrc}
    alt=""
    loading="lazy"
    decoding="async"
  />
) : (
  <S.AvatarFallback aria-hidden="true">{member.initials}</S.AvatarFallback>
)}
```

Keep the existing link, name, and role markup and the founder styling untouched.

- [ ] **Step 3: Use it in the team profile strip and lightbox**

In `TeamHero.tsx`, add `import { useAppTheme } from '@/app/theme-context'` and import `teamAvatarSrc` from `../avatar`, call `const { theme } = useAppTheme()` next to the existing `useState` calls, and add `const avatarSrc = teamAvatarSrc(member.avatar, theme)`.

- Change the strip condition from `member.avatar ?` to `avatarSrc ?` and pass `src={avatarSrc}` to `S.Avatar`.
- Change the lightbox condition to `lightbox && avatarSrc && member.avatar` and pass `src={avatarSrc}` while keeping `alt={member.avatar.alt}`.
- Leave the `ProfileCoverArt` hero art, actions, stats, and the 120/144px frames unchanged.

- [ ] **Step 4: Verify**

Run `npm run typecheck` and `npm run lint`; both must pass. Then open `/` and one `/team/<slug>` in the dev server, switch theme, and confirm the image swaps and no request 404s appear in the network panel.

### Task 4: Add the dark-photo field to admin

**Files:**
- Modify: `src/features/admin/team/TeamAdminPage.tsx:99-105` (validation), `:138-149` (save), `:356-379` (form fields)

**Interfaces:**
- Consumes: `TeamAvatar.darkSrc` from Task 2.
- Produces: admin form field name `avatarDarkSrc`; saved shape `avatar: { src, darkSrc?, alt }`.

- [ ] **Step 1: Validate the new field**

In `validate()`, after the `avatarSrc` checks, add:

```ts
const avatarDarkSrc = text(data, 'avatarDarkSrc')
if (avatarDarkSrc && !avatarSrc) {
  errors.avatarDarkSrc = 'Add the photo URL above before the dark-mode photo.'
} else if (avatarDarkSrc && !isImageRef(avatarDarkSrc)) {
  errors.avatarDarkSrc = 'Enter a full image URL (https://…) or a /path, or leave it empty.'
}
```

- [ ] **Step 2: Persist it**

In `save()`, read `const avatarDarkSrc = text(data, 'avatarDarkSrc')` beside `avatarSrc`, then build the avatar as:

```ts
avatar: avatarSrc
  ? {
      src: avatarSrc,
      darkSrc: avatarDarkSrc || undefined,
      alt: text(data, 'avatarAlt'),
    }
  : null,
```

- [ ] **Step 3: Add the field to the Photo fieldset**

Between "Photo URL" and "Photo alt text", add:

```tsx
<TextField
  idPrefix={p}
  name="avatarDarkSrc"
  label="Dark-mode photo URL"
  optional
  type="url"
  hint="Shown in dark theme. Empty uses the photo above."
  defaultValue={record?.avatar?.darkSrc}
  error={errors.avatarDarkSrc}
/>
```

- [ ] **Step 4: Verify**

Run `npm run typecheck` and `npm run lint`; both must pass. Open `/admin/team`, edit Orlando: the dark URL is prefilled. Clear the main photo URL but keep the dark one and save: the dark field shows the validation error and nothing saves. Restore both and save; the public team strip still renders.

### Task 5: Full verification

**Files:** none modified.

- [ ] **Step 1: Run the project checks**

Run, in order: `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`.

Expected: all pass; the build completes and copies the four new files into `dist/images/team/`.

- [ ] **Step 2: Verify both themes on the public pages**

Use the dev server (restart it first if it was already running, since it has served stale transforms before). Check:

- `/` at 1445 and 390: light theme shows the white portraits, dark theme shows the dark portraits; faces stay recognizable at 80/96px; hover lift/ring behavior unchanged.
- `/team/orlando-dela-cruz` and `/team/darcy-tabafunda` at 1445 and 390, both themes: strip photo matches the theme; click opens the lightbox with the same-theme photo and the real alt text; toggle the theme while the lightbox is open and confirm the image changes.
- `/` at 320: no horizontal overflow from the strip.

Expected: correct photo in each state, no console errors, no 404s for `/images/team/*`.

- [ ] **Step 3: Verify the OG image and the legacy fallback**

- In the team page HTML, `og:image` must be the white-background path (`/images/team/orlando-dela-cruz.jpg` / `darcy-tabafunda.jpg`).
- Legacy fallback: in `/admin/team`, clear Orlando's "Dark-mode photo URL" only and save (this writes a stored record without `darkSrc`), then load `/` and his profile in dark theme and confirm the white photo shows, not a broken image. Restore the dark URL and save.
- Missing-photo fallback: in `/admin/team`, temporarily clear Darcy's photo URL and alt, save, and confirm the initials fallback appears in both themes; then restore both fields.

- [ ] **Step 4: Stop**

Do not commit. Report the checks, the final byte sizes, and any visual caveat (for example, the dark-gray disc on the navy theme) and wait for approval.
