# Marvin Ola — Personal site

Personal portfolio of **Marvin Ola**, Technical Lead & Full Stack Engineer.
Retro 8-bit look, recruiter-friendly content: pixel type for headings and flavor,
readable type for everything you actually need to read.

Static site — no framework, no build step, no trackers. Deployable as-is to GitHub Pages.

## Run locally

ES modules don't load from `file://`, so serve the folder:

```bash
npm run dev        # python3 -m http.server 8080 → http://localhost:8080
```

## Structure

```
index.html                  Semantic markup; English content baked in (SEO / no-JS)
assets/
  css/
    tokens.css              Colors, fonts, spacing — the only place they're defined
    base.css                Reset, document defaults, scanlines, utilities
    components.css          Pixel box, buttons, tags, icons, language switch, toast
    sections.css            Header, hero, achievements, about, timeline, skills, education, contact
  js/
    main.js                 Entry point: wires up the modules below
    i18n/
      index.js              Translation engine (detect, apply, persist, URL sync)
      locales/en.js         English strings
      locales/es.js         Spanish strings
    modules/                Small single-purpose UI modules (nav, reveal, toast, copy, konami…)
  img/favicon.svg
scripts/check-i18n.mjs      Fails if any locale is missing a key used by the page
```

## Translations (EN / ES)

- Mark text with `data-i18n="key"`; attributes with `data-i18n-attr="aria-label:key;content:key2"`.
- Add the key to **every** file in `assets/js/i18n/locales/`.
- Run `npm run check` (also runs in CI on every PR).

Language resolution order: `?lang=` in the URL → the visitor's last choice (localStorage)
→ browser language → English. Choosing a language updates `<html lang>`, the title, meta
description and the URL (`?lang=es`), so a Spanish link can be shared directly.

Adding a third language = one new file in `locales/`, register it in `i18n/index.js`,
and add a button with `data-lang-option="xx"` to the switch.
