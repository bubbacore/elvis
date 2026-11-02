# Changelog

## [0.5.0](https://github.com/bubbacore/elvis/compare/v0.4.0...v0.5.0) (2026-11-02)


### ⚠ BREAKING CHANGES

* **guidelines:** Apply the new logo hierarchy, 1x pupil clear space, monochromatic interface, typography roles and component-specific focus. Use singular first-person copy only beside the character. Replace the former assets, font paths and token roles as documented in CONSUMERS.md.
* **fonts:** The interface family is now "Bubba Serif" instead of "Playfair Display": font.family.text and the font-family values of the typography levels resolve to "Bubba Serif", and fonts.css serves it from fonts/bubba-serif/bubba-serif.woff2 instead of fonts/playfair-display/playfair-display.woff2. Write "Bubba Serif" in font-family, or use var(--bubba-font-family-text).
* **tokens:** Spacing, corners and touch targets changed:
    - space.12 (48 px) and space.16 (64 px) are removed; the nearest steps
      of the new scale are space.14 (56 px) and space.20 (80 px). space.1,
      2, 3, 4, 5, 6, 8 and 10 keep their names and values.
    - radius.control (6 px) is renamed to radius.pill (999 px): controls
      are pills.
    - radius.app-icon (12 px) is removed: the app icon corner belongs to
      the exports; the same 12 px is now radius.card. radius.highlight
      (24 px) is new.
    - target.min-size keeps its name and goes from 44 px to 24 px, the
      minimum of WCAG 2.5.8; target.control-height (40 px) is new, for the
      main controls on phones.
    - focus.width, focus.offset and border.width keep their names and
      values; focus.spread (1 px) is new.
* **tokens:** The typography tokens were replaced:
    - typography.title.xs, sm, md, lg and xl are replaced by
      typography.display.base and wide, typography.character.base and wide
      (character and 404 title), and typography.title.1, 2 and 3, each with
      base and wide.
    - typography.text.sm, md and lg are replaced by typography.body (17 px)
      and typography.body-small (15 px).
    - typography.figures is replaced by typography.time, for session times;
      the box office price uses typography.body-small or typography.body in
      font.weight.text.regular.
    - New levels: typography.control, typography.field,
      typography.metadata (Marcação), typography.label (Label),
      typography.block-label (Rótulo de bloco) and typography.marker
      (Marcador).
    - The fontWidth extension of the levels and the
      --bubba-typography-*-font-width variables are removed, with
      font.width.title (--bubba-font-width-title): they existed only for the
      width axis of Noto Serif Display. The levels now carry
      fontVariantNumeric in the extension and the
      --bubba-typography-*-font-variant-numeric variables.
    - font.size.title.xs, sm, md, lg and xl and font.size.text.sm, md and lg
      are removed: the sizes live in the typography levels, such as
      --bubba-typography-body-font-size.
    - font.weight.title is removed: titles use font.weight.text.semibold
      (600).
    - font.weight.text.medium is removed: Playfair Display uses 400, 600 and
      700. The medium weight of Antonio is font.weight.label.medium (500),
      next to the new font.weight.label.light (300).
    - font.weight.text.regular (400) and font.weight.text.bold (700) keep
      their names.
* **fonts:** Noto Serif Display and Hanken Grotesk leave the package. fonts.css declares "Playfair Display" (weights 400 to 900) and "Antonio" (weights 100 to 700), served from fonts/playfair-display/playfair-display.woff2 and fonts/antonio/antonio.woff2; the files under fonts/noto-serif-display/ and fonts/hanken-grotesk/ are gone. font.family.text keeps its name and becomes Playfair Display. font.family.title is removed: titles use font.family.text. The new font.family.label is Antonio.
* **tokens:** The semantic colors were renamed or removed. Migrate each CSS variable and tokens.json path as follows:
    - color.surface.paper keeps its name and becomes #F7F7F7, the page
      background; cards use the new color.surface.card (#FFFFFF).
    - color.surface.support is removed: light pills inside cards use
      color.surface.paper and pills on the page use color.surface.card.
    - color.surface.past is removed: a session that already started keeps
      the card background and uses color.text.attention and
      color.border.attention.
    - color.surface.brand-blue is removed: there is no blue surface; the
      dark logo frames use color.surface.logo-frame.
    - color.text.ink keeps its name and becomes #050505.
    - color.text.ink-muted is renamed to color.text.body ([#717171](https://github.com/bubbacore/elvis/issues/717171)).
    - color.text.brand-blue is renamed to color.text.blue (#496EA1).
    - color.text.on-brand-blue is renamed to color.text.inverse.
    - color.border.control is renamed to color.border.field (#7190BC).
    - color.border.divider is removed: the new identity has no divider
      color, and cards are separated by their surface.
    - color.action.brand-blue is split into color.action.primary (#496EA1),
      for the primary action, and color.action.selected (#050505), for the
      active filter.
    - color.focus.feather-red is replaced by color.focus.filter (#050505),
      color.focus.action (#496EA1) and color.focus.field (#7190BC).
    - color.alert.feather-red is renamed to color.text.attention (#E03405).
    New tokens: color.surface.card, color.surface.mist,
    color.surface.no-sessions-day, color.surface.logo-frame,
    color.text.disabled, color.border.blue, color.border.attention,
    color.action.disabled and color.halo.strong, medium and soft.
* **logo:** the feathered identity is gone. Old and new paths:
    - exports/svg/wordmark-color.svg -> exports/svg/horizontal-lockup-black.svg
    - exports/svg/{wordmark,icon-b-feather,icon-feather}-{color,blue,light}.svg
      and their exports/png/ files -> exports/svg/{horizontal-lockup,
      vertical-lockup,wordmark,icon}-{black,white}.svg and their PNGs
    - exports/favicon/favicon.svg, favicon.ico, favicon-16.png,
      favicon-32.png, favicon-48.png and apple-touch-icon.png keep their paths
      with the new icon
    - exports/favicon/favicon-192.png and favicon-512.png are removed
    - logo/wordmark*.svg, logo/icon-b-feather*.svg and logo/icon-feather*.svg
      -> logo/{horizontal-lockup,vertical-lockup,wordmark,icon}-{black,white}.svg,
      logo/bubba-3d.png and logo/{horizontal,vertical}-lockup-3d.{svg,png}
    - new: exports/png/bubba-3d-{256,512,1024}.png and
      exports/png/bubba-3d-halo-{480,960}.png

### Features

* **fonts:** replace the fonts with Playfair Display and Antonio ([d22739e](https://github.com/bubbacore/elvis/commit/d22739e5bddb2b21590af48b969214aeee65ad22))
* **fonts:** ship the Playfair Display subset as Bubba Serif ([90b8b7b](https://github.com/bubbacore/elvis/commit/90b8b7b17fab3a1e6f39ff000d9902b334d5ec7d))
* **guidelines:** replace usage and voice with the new identity ([483ed4e](https://github.com/bubbacore/elvis/commit/483ed4ed3f7d8a239443f27fb8533c6e76b9d618))
* **logo:** replace the feathered logo with the new identity ([a288d8e](https://github.com/bubbacore/elvis/commit/a288d8e846787b2e44a7152110404b8e8687c0a6))
* show the new identity in the visual reference ([ef8384f](https://github.com/bubbacore/elvis/commit/ef8384f0cad75538dceecb293f90542da43c1f7e))
* **tokens:** add the motion duration and easing ([0a09fa9](https://github.com/bubbacore/elvis/commit/0a09fa998a976c45d587ce2fa76c687c6e7b05e1))
* **tokens:** replace the colors with the palette of the new identity ([9888446](https://github.com/bubbacore/elvis/commit/98884461dad009bb79f7a2e1d0ee56391da4f692))
* **tokens:** replace the spacing, corners, focus and touch targets ([ba531d7](https://github.com/bubbacore/elvis/commit/ba531d75c98b264ed6a0d145b00b2b80ac91c125))
* **tokens:** replace the typography with the approved level table ([d722d75](https://github.com/bubbacore/elvis/commit/d722d752024977b3dd99e207b634a32cbd8bf767))

## [0.4.0](https://github.com/bubbacore/elvis/compare/v0.3.0...v0.4.0) (2026-10-24)


### Features

* **guidelines:** cite the footer instead of the about page ([3fc7ace](https://github.com/bubbacore/elvis/commit/3fc7ace850f4bdd0f3f0a474a8ff8191941e8008))
* **guidelines:** describe the visual direction and typography levels ([02c6be6](https://github.com/bubbacore/elvis/commit/02c6be617638c6febf0d4f90e5a35ce4df91332e))
* **tokens:** add typography levels with line heights ([d1a56f5](https://github.com/bubbacore/elvis/commit/d1a56f52edac5979fbbc7953227d84ff31082c76))

## [0.3.0](https://github.com/bubbacore/elvis/compare/v0.2.0...v0.3.0) (2026-10-18)


### Features

* **tokens:** ship the contrast pairs in tokens.json ([712594d](https://github.com/bubbacore/elvis/commit/712594d93e4af31f13c09f244c2b6b704f92f7f7))

## [0.2.0](https://github.com/bubbacore/elvis/compare/v0.1.0...v0.2.0) (2026-10-17)


### Features

* **guidelines:** revise the location texts in the voice guide ([2e72c42](https://github.com/bubbacore/elvis/commit/2e72c42fbcbe5df97a28883141b59e902e5c1a70))

## 0.1.0 (2026-10-15)


### Features

* add approved brand usage rules and logo exports ([2cb6840](https://github.com/bubbacore/elvis/commit/2cb6840837c830ebe282d2fbb75e415495bbf4fd))
* add approved Bubba brand assets ([c7ea088](https://github.com/bubbacore/elvis/commit/c7ea0887d99635ca0817ce4eb3d54bd0ed47725a))
* add DTCG tokens with base spacing, type scale and focus ([d4e3c1a](https://github.com/bubbacore/elvis/commit/d4e3c1a5f7e3d40f03b0212ff61429a20a644d48))
* add the Bubba voice guide ([8c3d794](https://github.com/bubbacore/elvis/commit/8c3d794109d3116eb17bb0ea281ed59753b2cf76))
* expose the public entries of the package with a license ([cac7ea2](https://github.com/bubbacore/elvis/commit/cac7ea2b512b5ca7690875f9cdd607986a2be656))
* generate the package outputs from the sources ([b324783](https://github.com/bubbacore/elvis/commit/b32478375b74e860ea98f5109976a609ba355ac6))


### Bug Fixes

* keep every title in sentence case ([adc2138](https://github.com/bubbacore/elvis/commit/adc213865b2814390dcd720230515cce4d94b399))
* **logo:** render the PNG exports and favicons with resvg ([ae4f5e2](https://github.com/bubbacore/elvis/commit/ae4f5e247f85632145976f5d4c317cc89a675a5e))
