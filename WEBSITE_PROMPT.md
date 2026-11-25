# Prompt: Modern Agency Website (Bootstrap 5 + SCSS + Vanilla JS)

Copy everything below the line into a new AI chat. Fill in the `[PLACEHOLDERS]` first.
This is the brief that produced the aiDzines site, including the fixes made after the first draft.

---

## Brief

Design and build a modern, trendy, multi-page website for **[COMPANY NAME]**, a **[web design & development, UI/UX, mobile app development, SEO, digital marketing and branding]** company established in **[YEAR]**, based in **[CITY / COUNTRY]**.

The design must be catchy and visually rich, comparable to an award-site studio. Use a **dark theme only** (no light mode or theme toggle). Fill every page with realistic content: services, pricing, projects, testimonials, team, FAQs and job openings. Keep the numbers believable for a company founded in [YEAR], with no inflated stats.

### Business details
- Brand name & wordmark: **[COMPANY NAME]** (highlight part of it, e.g. `<b>ai</b>Dzines`)
- Email: **[hello@domain.com]**, careers email: **[careers@domain.com]**
- Phone / WhatsApp: **[+91 XXXXX XXXXX]** (use `https://wa.me/[NUMBER]` for WhatsApp)
- Currency: **INR (₹)** with Indian number formatting (₹1,50,000, ₹1.5L)
- Social links: Instagram, LinkedIn, Dribbble, Behance, X

---

## Tech stack & rules (strict)

1. **Plain static HTML pages**: no framework and no build step required to view.
2. **Bootstrap 5.3 (CDN)**, used **only** for:
   - Grid (`container`, `row`, `col-*`)
   - Navbar (`navbar`, `navbar-expand-lg`, `collapse`, `navbar-toggler`, `nav-link`)
   - Accordion (`accordion`, `accordion-item`, `accordion-button`, …)
   - Buttons (`btn` as the base class only)
   - **No other Bootstrap utilities**: no `d-flex`, `mb-3`, `text-center`, `visually-hidden`, etc.
3. **Bootstrap Icons (CDN)** for icons.
4. **All custom classes in camelCase** (e.g. `heroTitle`, `bentoCard`, `btnPrimary`, `sectionHead`, `srOnly`).
5. **SCSS controls all styling**:
   - No inline styles. The only exception is CSS custom properties used as data, e.g. `style="--c1:#7b61ff"` or `style="--h:60%"`.
   - Restyle Bootstrap components through their CSS variables (`--bs-btn-*`, `--bs-accordion-*`).
6. **Vanilla JavaScript** in a single `assets/js/main.js` file. No jQuery, GSAP or other libraries beyond Bootstrap's bundle.
7. **Google Fonts:** `Space Grotesk` (body/headings) + `Instrument Serif` italic (accent words), loaded with `<link>` in `<head>`.
8. Compile with Dart Sass: `npx sass assets/styles/styles.scss assets/styles/styles.css` (or Live Sass Compiler).

### Folder structure
```
/index.html  /about.html  /services.html  /portfolio.html
/careers.html  /enquiry.html  /contact.html
/assets/images/hero.jpg
/assets/js/main.js
/assets/styles/styles.scss        ← entry, only @use statements
/assets/styles/abstracts/_variables.scss  _mixins.scss  _index.scss (@forward both)
/assets/styles/base/_themes.scss  _base.scss  _typography.scss  _animations.scss
/assets/styles/components/_buttons.scss  _navbar.scss  _footer.scss  _common.scss
                          _accordion.scss  _forms.scss  _mockups.scss  _layout.scss
/assets/styles/pages/_home.scss  _services.scss  _portfolio.scss  _about.scss
                     _careers.scss  _enquiry.scss  _contact.scss
```
Use `@use "../abstracts" as *;` in partials (the module system, not `@import`).

---

## Design system

### Colours (CSS custom properties on `:root`, defined in `_themes.scss`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#000f16` | page background (deep teal-black) |
| `--bgSoft` / `--bgRaised` | `#04161f` / `#072230` | panels |
| `--surface` | `rgba(255,255,255,.035)` | cards |
| `--border` / `--borderStrong` | `rgba(255,255,255,.09)` / `.18` | hairlines |
| `--text` / `--textMuted` / `--textFaint` | `#eef6f8` / `#8ea3ab` / `#5b6f77` | type |
| `--accent` | `#c6ff3d` (acid lime) | primary buttons, active nav, highlights |
| `--secondary` | `#7b61ff` (violet) | charts, glows |
| `--tertiary` | `#22d3ee` (cyan) | glows |
| `--gradientText` | `linear-gradient(100deg, lime, cyan, violet)` | accent words |
| `--headerBg` | `rgba(3,20,28,.92)` | solid navbar on scroll |
| `--invertBg` | `#f4f6f1` | light CTA panel for contrast |

### Typography
- Fluid display sizes with `clamp()` (XL ≈ 2.75rem → 6.75rem).
- Tight letter-spacing (−0.03 to −0.055em) on headings.
- Accent words in `.serifItalic` (Instrument Serif italic), often combined with `.gradientText`.
- Small uppercase `.eyebrow` labels with a pulsing lime dot.

### Visual language
- Background grid lines plus a static noise texture (fixed, `pointer-events:none`).
- Large blurred gradient blobs (lime / violet / cyan) that float slowly behind hero sections.
- Rounded cards (radius 18–40px), 1px borders and a spotlight hover glow that follows the cursor.
- Pure-CSS device mockups as project artwork, so no images are needed:
  - browser window with dots and placeholder lines
  - phone with notch
  - analytics card with an animated SVG line chart
  - brand mark with colour swatches
  - each colourable via `--c1` / `--c2`
- Bento grid for services (12-column CSS grid, wide and narrow cards).
- Light "inverted" CTA panel near the bottom of each page, with a spinning conic-gradient orb and circular rotating text.
- Huge faded wordmark of the brand name in the footer.

### Buttons
- `.btn` + `.btnPrimary` (lime, glow shadow), `.btnGhost` (outline) or `.btnDark`, plus size modifiers `.btnSmall` / `.btnLarge`.
- Structure: `<span class="btnLabel" data-text="Label"><span>Label</span></span><span class="btnIcon"><i class="bi bi-arrow-up-right"></i></span>`
- Hover: the label rolls up (via `::after` + `data-text`) and the icon rotates 45°.
- `.arrowLink` for inline links (underline grows on hover).

---

## Pages & sections

**Shared on every page:**
- Skip link, scroll progress bar and cursor glow.
- Fixed header: pill-shaped navbar with the active link in lime and a "Start a project" CTA. On mobile, a burger icon morphs into an X.
- CTA band, then footer: newsletter, 4 link columns, socials, giant wordmark and copyright with an auto-updating year.
- Floating **WhatsApp button** (bottom-right, green, pulsing ring, "Chat with us" label on hover) with a **back-to-top** button above it.

1. **Home**
   - Hero:
     - "booking now" badge
     - headline with rotating words (websites / apps / brands / growth)
     - two CTAs
     - avatar stack and rating
     - right-hand composition of floating cards (analytics dashboard with growing bars, phone mockup, growth chip, code chip, orbit ring) with mouse parallax via `data-depth`
     - scroll hint
   - Then:
     - scrolling marquee of services
     - services bento grid (7 cards)
     - About statement whose words light up as you scroll, with counters and a tilt image card
     - 4-step process
     - 4 featured projects in a staggered 2-column layout
     - draggable testimonial slider with arrows
     - industries tag cloud
     - FAQ accordion with a sticky intro column
     - CTA
2. **Services**:
   - Page hero with stats and a tilted lime marquee.
   - Sticky side index with scrollspy, next to 7 detailed service cards:
     - intro
     - "What's included" checklist
     - tools and tech tags
     - "Starting from ₹…" price plus an enquire link that pre-selects the service (`enquiry.html?service=seo`)
   - 3 pricing plans (middle one highlighted), tech-stack icon grid, FAQ, CTA.
3. **Portfolio**:
   - Filter buttons with automatic counts (All / Web / Mobile / UI-UX / Branding / SEO & Marketing).
   - 9 project cards with CSS mockups, category, year, tags and a key result.
   - Clicking a card opens a **case-study drawer** (slides in from the right; closes with Esc or the scrim). Its content comes from a `<script type="application/json" id="caseData">` block: challenge, what we did, 3 results, stack.
   - Stats strip, CTA.
4. **About**: story with a pull-quote, 4 value cards, vertical gradient timeline from the founding year to now, team cards (initials on gradient portraits, socials slide up on hover), testimonials, CTA.
5. **Careers**: culture tiles bento, 6 perk cards, open roles in an accordion (title, tag pills, responsibilities/requirements, "Apply now" mailto link), open application card, 4-step hiring process.
6. **Project enquiry**:
   - Sticky left column with "what happens next" steps and a response-time card.
   - Right column holds a **4-step form** with a stepper:
     - Services (multi-select chips) + project type
     - Budget range slider in ₹ (live label, filled track) + timeline chips + details + website
     - Contact details
     - Review summary + submit
   - Each step is validated before moving on, and a success state shows the person's first name.
7. **Contact**: 4 contact cards (email, phone, WhatsApp, careers), message form with validation and success state, illustrated SVG map with a floating pin, studio hours (today highlighted), FAQ.

---

## Animations & interactions (`main.js`)

- `.hasJs` class added in `<head>` so reveal styles only apply when JS runs.
- **Scroll reveal:** `data-reveal="up|down|left|right|scale|blur|fade"` + `data-delay="1..6"`, using IntersectionObserver.
- **Split headlines:** `data-split` wraps each word in a mask and animates them in a stagger.
- **Counters:** `data-count="60"` animates on view (supports decimals).
- **Rotating words** in the hero.
- **Magnetic buttons** (`data-magnetic`), **spotlight cards** (`data-spotlight`), **3D tilt** (`data-tilt`), hero parallax and cursor glow. These are desktop / fine-pointer only.
- Scroll-lit statement text, draggable slider, scrollspy, portfolio filter, case drawer, multi-step form, form validation, newsletter.
- Respect `prefers-reduced-motion`: show everything instantly and turn off loops.
- Forms are front-end only. Put the submission in one clearly marked function (`fakeSubmit`) so a backend (PHP mail / API) can be plugged in later.

---

## Known pitfalls: avoid these (learned from v1)

1. **Navbar flicker:**
   - Keep the header **always fixed**. No hide-on-scroll-down.
   - On scroll, use a **near-opaque solid background** (`--headerBg`), not `backdrop-filter` blur. Blur re-renders over animated cards and flickers.
   - Give the header `transform: translateZ(0)`, keep its padding constant (no layout changes on scroll), and update scroll state with `requestAnimationFrame`.
2. **Gradient text flicker / slow load:**
   - Never split a `.gradientText` element into separately transformed word spans. `background-clip:text` doesn't paint through transformed children.
   - In the split-text script, treat `.gradientText` and `.wordRotator` elements as a single unit.
   - Add `box-decoration-break: clone` and a small `padding-right` so italic glyph tails aren't clipped.
3. **Don't animate full-screen fixed overlays** (noise/grain). Keep them static; animating them forces constant repaints.
4. Reduced-motion CSS must still beat attribute selectors like `[data-reveal="up"]`. Make sure `.isRevealed` is added immediately in that mode.
5. Stacked columns on mobile need explicit vertical spacing hooks (e.g. `.processCol`, `.enquiryFormCol`).
6. Use `.srOnly` (custom) instead of Bootstrap's `visually-hidden`.

---

## Quality bar
- Responsive from 360px to 1440px+, with no horizontal scroll (`overflow-x:hidden` on body).
- Accessible:
  - semantic landmarks and one `h1` per page
  - `aria-label`s on icon buttons
  - `aria-current` on the active nav link
  - visible `:focus-visible` rings
  - labelled form fields with error messages
  - drawer closable with Esc
- SEO: unique `<title>` + meta description + Open Graph tags per page, and an inline SVG favicon.
- Performance: preconnect to fonts, CSS-only artwork, no heavy libraries, passive scroll listeners.

## Deliverables
1. All 7 HTML pages, complete with content.
2. The full SCSS architecture above, compiled to `styles.css`.
3. `main.js`.
4. A short summary of placeholders to replace: contact details, WhatsApp number, testimonials, team, prices, and the form backend.
