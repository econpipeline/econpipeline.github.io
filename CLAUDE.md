# CLAUDE.md — Economics Pipeline website

Working conventions and guardrails for this repository. Claude Code reads this
file automatically when the repo is opened; human contributors should read it
too. For the file map, local-preview instructions, and deployment/DNS
reference, see **README.md**.

## What this repo is

The website for *The South African Economics Pipeline* — a static single-page
site plus two one-page factsheets. Plain HTML, CSS, and a little vanilla
JavaScript. **No build step, no framework, no dependencies**, and that is
deliberate: do not introduce bundlers, package managers, or frameworks.

It lives at `econpipeline/econpipeline.github.io` and is served by GitHub Pages
at <https://econpipeline.org>.

## Read this first — the site is LIVE

- **`main` is production.** Every push to `main` publishes to
  <https://econpipeline.org> within about a minute. There is no staging
  environment. Treat the branch accordingly.
- The public contact `info@econpipeline.org` is live and forwards to Johan.

## How to make a change

1. **Pull the latest `main`** before you start.
2. **Preview locally.** From the repo folder:
   ```bash
   python -m http.server 8000      # then open http://localhost:8000
   ```
   Always look at your change in a browser before it goes anywhere.
3. **Pick the right route:**
   - *Trivial copy fix* (a typo, a sentence, adding a mentor who has confirmed
     in writing): commit straight to `main` after previewing locally.
   - *Anything structural* (layout, CSS tokens, JavaScript, a new section, a
     design change): use a short-lived branch and a pull request so a second
     person — or their Claude — can review before it is live:
     ```bash
     git checkout -b short-descriptive-name
     # edit, preview, commit
     git push -u origin short-descriptive-name
     gh pr create --fill
     ```
4. **Commit messages:** clear and present-tense, one logical change each —
   e.g. "Add Eriksson to mentors", "Fix donor button spacing".

## Conventions

- **Content** lives in the `.html` files, grouped by `<!-- SECTION -->`
  comment banners. **Design tokens** (colour, type, spacing) live in the
  `:root { ... }` block of `assets/css/styles.css`. Change the token, not a
  one-off value, so the design stays consistent.
- **Do not commit:** editor temp files (`*.tmp.*` — already git-ignored),
  screenshots, scratch files, or anything containing credentials or personal
  data. Nothing secret belongs in a public repo.
- If you edit a factsheet's HTML, **regenerate its PDF** (e.g.
  `donor-factsheet.pdf`) so the download link on the site matches the page.

## Guardrails — do not change these without checking with Johan

- **`CNAME` and `.nojekyll`** control the custom domain and how Pages serves
  the files. Leave them as they are.
- **DNS (Porkbun/Cloudflare) and the `info@` email forward** are managed by
  Johan outside this repo. The repo only requests the domain via `CNAME`.
- **Mentor names:** add an external mentor (and any photo) only after they have
  confirmed in writing.
- **Donor giving mechanics** and the **application route** are deliberate
  placeholders pending external arrangements — see "Items still to finalise"
  in README.md. Do not invent EFT, portal, or Section 18A details.

## Brand and voice

Follows the Stellenbosch University brand (faculty-teal accent, self-hosted
Raleway type). Keep copy in clear, plain English; the audience is prospective
students, academics, and donors.

## For Claude specifically

- This is a **public, live** repository. For anything beyond a trivial copy
  edit, prefer a pull request over a direct push to `main`, and confirm before
  pushing if you are unsure.
- Never commit secrets or personal data. Never add a mentor who is not already
  listed unless you have been told they confirmed.
- Preserve the "no build step / no dependencies" property — match the existing
  hand-written HTML/CSS/JS style rather than reaching for tooling.
