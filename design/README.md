# Design

**The app is the source of truth.** Everything in this folder is a copy of, or a pointer to, the
AutoTrim app repo (`../../AutoTrim`, next to this one). Run `./design/sync-design.sh` to refresh
the copies; never edit them here.

| File | What it is | Source in the app repo |
|---|---|---|
| `tokens.css` | The canonical design tokens: colours, radii, type, waveform geometry, the `at-*` variables | `frontend/src/styles/tokens.css` (`design/redesign-2026-09/tokens.css` there is the older designer export, do not use it) |
| `HANDOFF.md` | The method notes of the app redesign: how artboards are read, the shared components, the rules that do not show on the mockups | `design/redesign-2026-09/HANDOFF.md` |
| `sync-design.sh` | Re-copies the two files above from the app repo (`AUTOTRIM_REPO` overrides the path) | — |
| `landing-2026-09/` | The v2 landing redesign: `BRIEF.md` (structure and copy, the contract for the design pass), then the landing's own artboards | — |

## Fonts

The same two variable families as the app, loaded from npm, not from a CDN:

- display: `@fontsource-variable/bricolage-grotesque` (`--at-font-display`)
- text and UI: `@fontsource-variable/schibsted-grotesk` (`--at-font-ui`)

Tabular figures only on the display face (`tabular-nums`); on Schibsted they widen ":" and break
timecodes. Text on the accent or on ivory is dark `#14100E`, never white.

## Artboards and the method

The app's artboards live in the app repo and are read in place, not copied:

```
../../AutoTrim/design/redesign-2026-09/artboards/
  01-upload … 10-customize-panel   (.dc.html)
  multicam/  m1-groupes, m2-groupe-coupe, m3-ajuster-synchro,
             p1-preview-simple, p2-preview-multicam, e1 … e6
```

They are `.dc.html` files exported from the design canvas: readable HTML where every value (hex,
padding, radius, size) is in clear. They do not open in a browser as-is (they reference the
canvas's `support.js` and an `<x-dc>` tag). **They are a source of values, not markup to copy.**
The landing design pass follows the same method, in this order:

1. read `HANDOFF.md`, then `tokens.css`;
2. read the app artboards for the screens the landing shows (session, export menu, preview, group
   card), to draw the product the way it really looks;
3. export the landing's own artboards as `.dc.html` into `landing-2026-09/artboards/`, one per
   section of the brief, values not markup;
4. implement from the tokens and a small set of shared components, never from the artboards'
   inline styles.

The animated capsules in `../capsules/` are drawn with the same tokens (`capsules/src/tokens.ts`).
