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
>
> Redesigned June 2026 after external UX review: students-first hero with
> Apply / Fund a bursary calls to action, the Treasury endorsement in a band
> below the hero, and the 2-vs-47 statistic demoted to the Vision section.

## Files

```
Website/
├── index.html              the whole page
├── donor-factsheet.html    one-page donor factsheet
├── donor-factsheet.pdf     PDF of the factsheet, linked from the Donors section
│                           (regenerate whenever donor-factsheet.html changes)
├── mentor-factsheet.html   one-page mentor factsheet
├── psg-phd-workshop-cfp.pdf
│                           call for papers for the PSG Economics PhD Workshop,
│                           linked from the Events section (built from
│                           PSGPhD/PSGPhD_CfP.tex with lualatex)
├── CNAME                   custom domain (econpipeline.org)
├── .nojekyll               tells GitHub Pages to serve files as-is
├── .gitignore              keeps editor temp files (*.tmp.*) out of the repo
├── README.md               this file
├── CLAUDE.md               working conventions and guardrails for the repo
├── .github/workflows/pages.yml
│                           publishes the site to GitHub Pages on every push
│                           to main (no build step; it uploads the files as-is)
└── assets/
    ├── css/styles.css      the main design system
    ├── css/factsheet.css   styles for the two factsheets
    ├── js/main.js          scroll reveals, nav, roadmap, apply-button gate, film player
    ├── js/analytics.js     Google Analytics 4, loaded only after consent
    ├── fonts/              self-hosted Raleway (TTF)
    └── img/                SU logo (white SVG), keynote + mentor headshots,
                            film-poster.jpg (the film's still – swap the file to
                            change it, no code change needed)
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

To publish a trivial copy fix, commit and push from inside the `Website/`
folder (anything structural goes via a short-lived branch and pull request –
see `CLAUDE.md`):

```bash
git add -A
git commit -m "Describe the change"
git push
```

GitHub Pages rebuilds within a minute or so. If you edit a factsheet's HTML,
regenerate its PDF so the download link matches, e.g. with headless Edge:

```
msedge --headless --no-pdf-header-footer --print-to-pdf="donor-factsheet.pdf" "donor-factsheet.html"
```

## The film

The Film section (between Vision and Students) carries the hero film, *"SA
Economics Pipeline: Why you should do a PhD in economics"*
(<https://www.youtube.com/watch?v=hkAsgt2NL6g>, ~10 min).

It is **click-to-load**. What the page ships is a self-hosted poster
(`assets/img/film-poster.jpg`) and a play button; the YouTube iframe is only
injected when the visitor clicks, and it points at `youtube-nocookie.com`. So
nothing is requested from YouTube – and no third-party cookie is set – until
the visitor asks for the film. That keeps the POPIA consent banner honest: it
covers analytics, and the film needs no separate consent because the click *is*
the consent. It also keeps the page fast, since the ~1 MB YouTube player is
never loaded for the majority who do not press play.

The markup is a real link to YouTube that the script upgrades in place, so the
film is still reachable if JavaScript fails, and right-click/middle-click behave
as people expect.

To change the video, edit the `data-yt` and `href` values on `.film__facade` in
`index.html` and drop in a new `film-poster.jpg`. To change the still only,
replace the JPG (1280×720) – no code change.

## Analytics

Visitor numbers are tracked with **Google Analytics 4** (property *Economics
Pipeline*, Measurement ID `G-NXG7TZLF6J`). The tag is **not** loaded until the
visitor clicks **Accept** on the POPIA consent banner, so no analytics cookies
are set otherwise. All the logic lives in one shared file,
`assets/js/analytics.js`, referenced from every page; the banner uses the
maroon/gold brand tokens and is hidden in print so it stays out of the
factsheet PDFs. The consent choice is remembered in `localStorage`
(`ga-consent` = `granted` | `denied`) and shared across pages, so it shows once.

- **See the numbers:** GA4 → *Reports → Realtime* (live check) and *Reports →
  Engagement → Pages and screens* (which pages get traffic).
- **Re-test the banner:** run `localStorage.removeItem("ga-consent")` in the
  browser console and refresh.
- **Film plays** fire a `film_play` event, but only for visitors who accepted
  analytics (`window.gtag` does not exist otherwise, and the call is guarded).
- Data runs from the June 2026 go-live onward. An earlier Plausible tag on
  `index.html` was never connected to an account, collected nothing, and has
  been removed – there is no historical data to recover.

## Items still to finalise

- **Donor giving details** – the Donors section invites donors to write to
  `info@econpipeline.org`, including for Section 18A details. Swap in EFT,
  online-portal and Section 18A specifics once arrangements with the SU
  Development & Alumni Relations office are finalised.
- **Application route** – the "Apply now" button is a `mailto:` to
  `apply@econpipeline.org` with a structured body, gated by JavaScript until
  applications open on 15 June 2026; swap in the application portal/form when
  it exists. **Confirm the `apply@` forward works** (send a test email with an
  attachment from an external account) before applications open – only the
  `info@` forward is confirmed live.
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
2. **Pages.** *Settings → Pages → Build and deployment → Source: GitHub
   Actions*, which runs `.github/workflows/pages.yml` on every push to `main`
   and serves the site within a minute or two. There is still no build step:
   the workflow just uploads the files as they are.

   This replaced the older *Deploy from a branch* setting on 6 August 2026,
   after that builder jammed: one build failed with no diagnostic and the
   retry sat unfinished for over half an hour, against a normal build time of
   about 25 seconds. Nothing was wrong with the repository. If the Actions
   route ever needs to be reverted, the branch setting still works in
   principle and `.nojekyll` is retained for it.
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
