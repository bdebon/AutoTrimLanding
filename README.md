# AutoTrim landing

The marketing home of [AutoTrim](https://autotrim.app): the site, its copy in four languages, the
SEO guides and compare pages, the animated capsules and the design source the v2 landing is
built from. The app itself lives in the `AutoTrim` repo next to this one.

Next 15 · React 19 · Tailwind 4 · next-intl (`en`, `fr`, `es`, `zh`) · PostHog, Meta Pixel and GTM.

## Layout

| Path | What it is |
|---|---|
| `app/[locale]/` | Pages: landing, `/download`, `/pricing`, `/guides/*`, `/compare/*` |
| `components/` | Landing sections and compare pages |
| `messages/{en,fr,es,zh}.json` | All copy, one namespace per section |
| `public/pricing.md`, `public/llms.txt` | Plain-text pricing and site summary for LLMs |
| `design/` | Design tokens, handoff notes and the v2 landing brief. The app is the source of truth: [`design/README.md`](design/README.md) |
| `capsules/` | The Remotion project of the animated capsules: [`capsules/README.md`](capsules/README.md), storyboards in [`capsules/CAPSULES.md`](capsules/CAPSULES.md) |
| `docs/tracking.md` | Analytics events |
| `.agents/` | Marketing context, cold-email and lifecycle copy, lead lists (not published) |

## Site

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Benjamin runs the server and the builds himself; agents do not (see `CLAUDE.md`).

## Capsules

Short animated capsules of AutoTrim v2, drawn with the app's tokens. Separate `package.json`,
nothing shared with the site.

```bash
cd capsules
npm install
npx remotion studio                      # live preview, timeline and props panel
npx remotion render Hero-fr out/hero-fr.mp4
npx remotion render Hero-en out/hero-en.mp4
npx remotion render Euh-fr out/euh-fr.mp4
npx remotion render Euh-en out/euh-en.mp4
npx remotion still Euh-fr out/frame.png --frame=225
```

Every capsule exists in FR and EN, 1920×1080 (landing) and 1080×1350 (`-4x5`, social). Renders
are H.264 yuv420p crf 16 (`capsules/remotion.config.ts`). The other capsules (#3 to #11) are
storyboarded in `capsules/CAPSULES.md` and get a composition each as they are built.

**Plan for the landing, not done yet:** each capsule the page uses is rendered three times into
`public/capsules/` — an H.264 MP4, a WebM and a poster PNG (its first frame), FR and EN. The
page plays them muted, looping, with the poster as placeholder; `es` and `zh` use the EN
renders. Which capsule goes in which section is in
[`design/landing-2026-09/BRIEF.md`](design/landing-2026-09/BRIEF.md). Do not render into
`public/` before the design pass has fixed the sizes.

## Design

`design/tokens.css` and `design/HANDOFF.md` are copies of the app's; refresh them with
`./design/sync-design.sh`. The v2 landing brief and, later, its artboards are in
`design/landing-2026-09/`.

## Commits

`feat(landing): …`, `fix(seo): …`, `chore(landing): …`, in the style of the log.
