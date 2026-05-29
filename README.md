# The South African Economics Pipeline – website

A single-page static site, with two one-page factsheets. No build step, no
framework, no dependencies – just HTML, CSS, and a little vanilla JavaScript.
The same files run unchanged on GitHub Pages **or** on the Stellenbosch
University web server.

> **Status: live at <https://econpipeline.org>.** Hosted on GitHub Pages from
> the `econpipeline/econpipeline.github.io` repository. Wordmark cleared by
> `branding@sun.ac.za`. The public contact `info@econpipeline.org` is live and
> forwards to `johanf@sun.ac.za`. Mentor and donor outreach is underway; the
> site lists only mentors who have confirmed in writing, and the application
> route is still a `mailto:` (see below). New mentors and placement partners
> are added as they confirm.

## Files

```
Website/
├── index.html              the whole page
├── donor-factsheet.html    one-page donor factsheet
├── mentor-factsheet.html   one-page mentor factsheet
├── CNAME                   custom domain (econpipeline.org)
├── .nojekyll               tells GitHub Pages to serve files as-is
├── .gitignore              keeps editor temp files (*.tmp.*) out of the repo
├── README.md               this file
└── assets/
    ├── css/styles.css      the main design system
    ├── css/factsheet.css   styles for the two factsheets
    ├── js/main.js          scroll reveals, nav, count-ups, roadmap
    ├── fonts/              self-hosted Raleway (TTF)
    └── img/                SU logo (white SVG), keynote + mentor headshots
```

## Preview it locally

From inside the `Website/` folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` directly via
`file://` also works, but a local server matches how it behaves when deployed.)

## Editing content

All copy lives in the HTML files, organised by section with clear comment
banners (`<!-- HERO -->`, `<!-- STUDENTS -->`, etc.). Edit the text, save,
refresh. Colours, type, and spacing are controlled by the tokens at the top of
`assets/css/styles.css` (the `:root { ... }` block).

To publish a change, commit and push from inside the `Website/` folder:

```bash
git add -A
git commit -m "Describe the change"
git push
```

GitHub Pages rebuilds within a minute or so.

## Items still to finalise

- **Donor giving details** – the Donors section currently directs interest to
  Prof. Fourie. Swap in EFT, online-portal and Section 18A details once
  arrangements with the SU Development & Alumni Relations office are
  finalised.
- **Application route** – the "Register your interest" button is a `mailto:`
  to `info@econpipeline.org` with a structured body; swap in the application
  portal/form when it exists.
- **Mentor names** – each new external mentor is added only after they
  confirm in writing.

(The public email forward, `info@econpipeline.org` → `johanf@sun.ac.za`, is
already live, so the address advertised on the site reaches us.)

## How it is deployed (for reference)

The setup is a GitHub organisation named `econpipeline`, holding a repository
named `econpipeline.github.io`, served at the custom domain `econpipeline.org`
(registered on Porkbun). This is already in place; the steps below record how
it was done and how to re-do it if ever needed.

1. **Organisation and repository.** A free GitHub organisation `econpipeline`
   holds a repository named exactly `econpipeline.github.io`. The contents of
   this `Website/` folder live at the repo root (so `index.html` sits at the
   top level, not inside a subfolder).
2. **Pages.** *Settings → Pages → Build and deployment → Source: Deploy from a
   branch → `main` / root*. GitHub serves the site within a minute of each push.
3. **Custom domain.** The included `CNAME` file requests `econpipeline.org`.
   With the DNS below in place, `econpipeline.org` is entered under
   *Settings → Pages → Custom domain*.
4. **HTTPS.** Once GitHub has verified the domain it issues a free certificate
   automatically (this can take from a few minutes up to about an hour after
   DNS resolves). When the certificate is ready, tick *Enforce HTTPS* under
   *Settings → Pages*. Until then the browser shows a "Not secure" warning,
   which clears on its own once the certificate is issued.

## DNS: pointing econpipeline.org at GitHub (Porkbun)

`econpipeline.org` is registered on Porkbun. In the Porkbun DNS panel
(*Details → Edit DNS Records*), remove any default parking records and set:

1. Four `A` records on the apex (host blank or `@`) → `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages IPs).
2. One `CNAME` on `www` → `econpipeline.github.io`.

The apex records are in place, so `econpipeline.org` resolves to GitHub. If
`www.econpipeline.org` does not work, check that the `www` record is a single
`CNAME` pointing to `econpipeline.github.io` and that no leftover parking
record (e.g. a `CNAME` to `pixie.porkbun.com`) remains. DNS changes can take
from a few minutes to a few hours to propagate.

## Moving to the Stellenbosch server instead

Nothing special is required – copy the contents of `Website/` to the web root
your colleague provides. The only GitHub-specific files (`CNAME`, `.nojekyll`)
are harmless to leave in place or can be deleted.
