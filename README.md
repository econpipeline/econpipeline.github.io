# The South African Economics Pipeline – website

A single-page static site. No build step, no framework, no dependencies – just
HTML, CSS, and a little vanilla JavaScript. The same files run unchanged on
GitHub Pages **or** on the Stellenbosch University web server.

> **Status: live.** Wordmark cleared by `branding@sun.ac.za`. Mentor and donor
> outreach is underway. The site lists only mentors who have confirmed; the
> application route is still a `mailto:` (see below). New mentors and
> placement partners are added as they confirm.

## Files

```
Website/
├── index.html              the whole page
├── CNAME                   custom domain (econpipeline.org)
├── .nojekyll               tells GitHub Pages to serve files as-is
├── README.md               this file
└── assets/
    ├── css/styles.css      the design system
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

All copy lives in `index.html`, organised by section with clear comment banners
(`<!-- HERO -->`, `<!-- STUDENTS -->`, etc.). Edit the text, save, refresh.
Colours, type, and spacing are controlled by the tokens at the top of
`assets/css/styles.css` (the `:root { ... }` block).

## Items still to finalise

- **Email forwarding** – the public contact is `info@econpipeline.org` (footer,
  application button, donor button). Set up forwarding for it in Porkbun
  (*Email → Email Forwarding* → forward to `johanf@sun.ac.za`) so messages
  actually arrive. The site advertises the address, so the forward must be live
  before launch.
- **Donor giving details** – the Donors section currently directs interest to
  Prof. Fourie. Swap in EFT, online-portal and Section 18A details once
  arrangements with the SU Development & Alumni Relations office are
  finalised.
- **Application route** – the "Register your interest" button is a `mailto:`
  with a structured body; swap in the application portal/form when it exists.
- **Mentor names** – each new external mentor is added only after they
  confirm in writing.

## Deploying on GitHub Pages

The setup is a GitHub organisation named `econpipeline`, holding a repository
named `econpipeline.github.io`, served at the custom domain `econpipeline.org`
(registered on Porkbun).

1. **Create the organisation (one-off).** Sign in to GitHub, then *avatar →
   Your organizations → New organization* (the Free plan is fine). Name it
   `econpipeline`. Add colleagues later under *People*.
2. **Create the repository** in that org, named exactly `econpipeline.github.io`.
   Upload the contents of this `Website/` folder to the repo root (so
   `index.html` sits at the top level, not inside a subfolder).
3. **Enable Pages.** Repo *Settings → Pages → Build and deployment → Source:
   Deploy from a branch → `main` / root*. Within a minute the site is live at
   `https://econpipeline.github.io/`.
4. **Custom domain.** The included `CNAME` file already requests
   `econpipeline.org`. After the DNS below is in place, enter `econpipeline.org`
   under *Settings → Pages → Custom domain* and tick *Enforce HTTPS*.

## Pointing econpipeline.org at GitHub (Porkbun)

`econpipeline.org` is registered on Porkbun. In the Porkbun DNS panel
(*Details → Edit DNS Records*), remove any default parking records and add:

1. Four `A` records on the apex (host blank or `@`) → `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages IPs).
2. One `CNAME` on `www` → `econpipeline.github.io`.

DNS can take from a few minutes to a few hours to propagate. GitHub then issues
a free HTTPS certificate automatically.

## Moving to the Stellenbosch server instead

Nothing special is required – copy the contents of `Website/` to the web root
your colleague provides. The only GitHub-specific files (`CNAME`, `.nojekyll`)
are harmless to leave in place or can be deleted.
