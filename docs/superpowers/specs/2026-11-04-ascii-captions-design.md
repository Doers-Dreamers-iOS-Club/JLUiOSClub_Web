# ASCII exhibition captions

Approved by the user: reveal one short classical-language caption below each ASCII image on hover, like a gallery label. Use `Fiat lux` for Creation of Adam, `πῦρ ἐγώ σφιν ὤπασα.` for Prometheus and `Ἀργὼ πᾶσι μέλουσα` for Argo. Preserve original Greek diacritics. Only the original text is visible.

Use locally hosted EB Garamond 400 with Latin, Greek and Greek Extended subsets and its OFL license. Caption size is 16px desktop / 15px mobile, 24px line height, theme secondary text color. Reserve the label space to prevent layout shifts. Hover enters after 120ms with a subtle 4px rise and fade; keyboard focus and mobile taps reveal the same text. Clear touch visibility on page exit; hide all labels during page transitions. Preserve the existing ASCII slot geometry and canvas targeting.

Validate font glyph coverage, no initial font downloads, hover/focus/touch behavior, no layout shifts or overflow, all three labels in light/dark and 320/390px screens, reduced motion, and existing full-page interactions. Keep the local preview and create a local commit without pushing, per the user's established workflow.

Validation completed: production build, all three labels in light/dark and desktop/320/390px browser checks, hidden/hover/focus/touch behavior, lazy font requests, no hover layout shift, reduced motion, and the existing full-page regression suite passed. FontTools verified that all selected Latin and polytonic Greek characters exist in the bundled font subsets. Screenshots are in `/private/tmp/club-caption-qa`.
