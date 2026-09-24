# Capsules — le carnet

Les capsules qui annoncent AutoTrim 2, dans l'ordre où elles valent le plus. La #2, « Euh. »,
est faite et sert de référence : mêmes règles, même kit (voir `README.md`). Chaque fiche
donne le message, la durée, le storyboard en secondes, la copie FR/EN, les données à
prendre dans l'app, et ce que le kit doit gagner pour la faire.

Principes communs, tirés de la #2 :

- **Une idée, un mouvement.** Six à douze secondes, en boucle propre (frame 0 = dernière).
  Seule la #1 est longue.
- **La capsule *est* l'écran**, reconstruit avec les tokens : pas de capture vidéo. Les
  formes d'onde viennent d'une vraie analyse (`src/data/*.json`, `scripts/extract-envelope.mjs`),
  jamais d'un signal synthétique.
- **Du poids.** Ease-out lents, springs sans rebond, staggers de 30–60 ms. Rien de linéaire.
- **Le vocabulaire de l'app** : gardé/retiré sur la bande derrière les barres, retiré =
  plus clair + hachuré, ivoire = ce que l'IA a trouvé, un seul accent, chiffres tabulaires
  sur la display face.
- Chaque capsule existe en FR et EN, en 1920×1080 et 1080×1350 (mise en page empilée, pas un
  recadrage), avec `soundtrack` et `captions` en props.

Statut : ☐ à faire · ◐ en cours · ☑ faite

Ton : la landing vouvoie ; les capsules aussi (jamais « tu », et « votre machine » plutôt que
« votre Mac »).

---

## ☑ 2 · « Euh. » — 8 s

Faite. Voir `README.md` et `src/capsules/euh/`.

---

## ☑ 1 · Hero — « Une heure de rushes. Trente secondes. » — 30 s

Faite. Voir `README.md` et `src/capsules/hero/`. Écarts avec la fiche ci-dessous :

- Les chiffres sont ceux d'une vraie heure (17 rushes OBS du 5 sept 2025) : `59:45 → 40:20`
  après les silences, `39:57` après les hésitations, `−33 %`, `521` coupes, `Montage
  économisé 1:29:07` (formule de l'app). Chip `Tournage · 5 sept · 17 fichiers`.
- L'analyse a été refaite hors de l'app (backend non lançable ici) : pipeline silences porté
  à l'identique, hésitations par CrisperWhisper small via le banc Python.
- Silences puis hésitations sur **le même rush** : après la fermeture, un goto fluide (flou de
  mouvement) jusqu'aux hésitations et le zoom y entre. Trois hésitations choisies à la main
  pour des lignes courtes (vrais mots en FR ; en EN, leur traduction sur la même onde).
- Multicam retiré du hero (Benjamin : il cassait la lecture, et la plupart des clients ne
  s'en servent pas) : simple mention « Aussi en multicam » sur la carte de fin. La scène
  (cartes qui tombent, recalage, carte groupe) est mise de côté dans `src/capsules/multicam/`
  pour la #3.
- Export (retour de Benjamin) : l'écran de session d'AutoTrim avec deux clips coupés, le menu
  d'export avec CapCut (« Ou un clip par coupe · ZIP », ce que l'app exporte pour CapCut).
  La coupe modifiée à la main l'est **dans le logiciel de montage**, une fenêtre neutre qui
  n'est pas AutoTrim : on tire le bord d'un clip de 4 images pour récupérer une respiration.
- **À vérifier dans l'app** : son menu d'export ne nomme pas CapCut ; la capsule l'y met.


**Message.** Tout ce que fait la v2, en un souffle : silences, hésitations, multicam,
timeline éditable. La seule capsule longue ; sert de vidéo de landing et de tweet
d'annonce.

**Storyboard.**

| s | Scène |
|---|---|
| 0–3 | Une longue onde grise entre par la droite, plus large que l'écran. Chip en haut à gauche `Tournage · 22 sept · 6 fichiers`. Compteur en bas à gauche `1:02:14`. Titre au centre puis remonte : *Une heure de rushes.* |
| 3–9 | **Silences.** Les creux se hachurent un à un (gauche → droite, ~40 ms d'écart, petit snap), puis les bandes se referment et l'onde se contracte, barres qui glissent avec poids (~700 ms). Compteur `1:02:14 → 41:30`, pill accent `−34 %`. Légende : *Silences retirés.* |
| 9–15 | **Hésitations.** Zoom sur une zone ; une ligne de transcript sous l'onde (`et donc… euh… ce que je veux dire`), le `euh` en ivoire, sa bande ivoire hachurée, fermeture ; trois ou quatre d'affilée à travers l'onde, chacune laisse un tick ivoire. Compteur `41:30 → 39:12`. Légende : *Les hésitations aussi.* Badge : *IA en local · rien n'est envoyé.* |
| 15–19 | **Multicam, court.** Six cartes fichier tombent en désordre, glissent sur un axe de temps commun, se recalent (les ondes s'alignent), se rassemblent en une carte groupe. Légende : *Plusieurs caméras, plusieurs micros, un seul drop.* |
| 19–25 | **Timeline.** L'onde contractée devient une timeline NLE : V1 avec ses coupes, audio dessous, les autres angles empilés au-dessus, atténués. Chip `Exporter la timeline · Final Cut Pro ▾` qui déplie Final Cut Pro / Premiere Pro / DaVinci Resolve (en texte). Une coupe est déplacée à la main de quelques images. Légende : *Votre timeline, prête. Chaque coupe reste éditable.* |
| 25–28,5 | **Chiffres.** Trois stat cards de l'app : `−36 %` · `Montage économisé 6:02` · `320 coupes`, qui montent. |
| 28,5–30 | **End card.** Pouls, *AutoTrim 2*, *Coupe les silences. Et les euh.* Tenue, puis boucle. |

**EN.** *An hour of footage.* · *Silences removed.* · *Hesitations too.* · *Local AI · nothing
uploaded.* · *Several cameras, several mics, one drop.* · *Your timeline, ready. Every cut
still yours.* · `Editing saved 6:02` · `320 cuts` · *Cuts the silences. And the ums.*

**Données.** Une vraie session longue : segments gardés/retirés et hésitations d'un rush
d'une heure (l'app écrit `removed_intervals` et les segments dans le payload de timeline ;
le cache `$TMPDIR/autotrim_cache/*.fcpxml` en garde une trace). Les chiffres finaux
doivent être ceux de cette session.

**Kit.** À ajouter : une onde longue qui défile et se contracte (canvas ou path SVG
précalculé, pas des milliers de nœuds), une `FileCard` et une `GroupCard`, une `NleTimeline`
(pistes empilées, coupes, tête de lecture), une `StatCard`, des transitions de scène
(push, fondu sur le fond). C'est la capsule qui fait grandir le kit le plus.

---

## ☐ 3 · « Trois caméras, deux micros, un drop. » — 10 s

**Message.** Le multicam sans explication : on lâche les fichiers, ils se rangent seuls.

**Storyboard.** 0–2 s : six fichiers tombent dans la fenêtre en désordre (deux caméras
démarrées en retard, une coupée en deux fichiers, deux WAV). 2–5 s : ils glissent sur un axe
de temps commun ; les ondes se recalent à l'image près, une par une, avec le petit snap ;
`synchro · 100 %` s'inscrit sur chacune. 5–7 s : les lignes se rassemblent en **une** carte
groupe, `1 prise · 3 caméras · 2 micros`. 7–9 s : un seul bouton, *Traiter le groupe*.
9–10 s : boucle.

**Copie.** *Trois caméras, deux micros, un drop.* / *Three cameras, two mics, one drop.*

**Données.** Les ondes de vrais fichiers d'un même tournage (le multicam de test).

**Kit.** `FileCard` (carte de la file d'attente, forme d'onde entière), axe de temps
commun, `GroupCard`, un mouvement de « recalage » réutilisable (translation + snap).
**Déjà là** : la scène retirée du hero, `src/capsules/multicam/MulticamDrop.tsx` (4 s, les six
fichiers des fixtures qui tombent, se recalent et deviennent un groupe), à reprendre.

---

## ☐ 4 · « Chaque micro, sa voix. » — 8 s

**Message.** La règle « jamais deux voix » : on ne coupe que quand personne ne parle.

**Storyboard.** Deux pistes de voix superposées, deux couleurs de gris. Une lame de coupe
descend sur un creux de la piste A… mais la piste B parle : la lame rebondit et remonte.
Elle redescend là où les deux se taisent : la bande se hachure et se ferme sur les deux
pistes à la fois. Trois fois, de plus en plus vite. Fin : *Une coupe seulement quand
personne ne parle.*

**Copie.** *Chaque micro, sa voix.* / *One mic per person.* — légende : *A cut only when
nobody speaks.*

**Kit.** Deux `WaveBars` empilés partageant la même grille, une `CutBlade` (trait vertical
avec rebond), fermeture simultanée sur deux ondes.

---

## ☐ 5 · « Le montage suit celui qui parle. » — 10 s

**Message.** Le montage automatique multicam : l'angle change avec la voix.

**Storyboard.** Mosaïque de trois angles (rectangles avec initiales ou silhouettes, pas de
visages), sous chacun sa barre de voix. La voix A s'active : l'angle A passe plein cadre
(les autres reculent en petit). B parle : bascule. Les deux ensemble : le plan large. Fin
: la timeline avec les angles empilés V1/V2/V3 et les switchs. Légende : *Chaque caméra
sur la personne qu'elle filme. Le plan large quand tout le monde parle.*

**Copie.** *Le montage suit celui qui parle.* / *The cut follows who's talking.*

**Kit.** `AngleTile` (tuile 16:9 avec barre de voix), layout mosaïque ↔ plein cadre
(spring), `NleTimeline` avec pistes empilées.

---

## ☐ 6 · « Le son de la caméra, ou le vrai. » — 6 s

**Message.** L'audio externe : lié tout seul, recalé à l'image, on choisit ce qu'on écoute.

**Storyboard.** Une carte caméra et une carte WAV. Le WAV glisse vers la caméra, s'y
attache (petit aimant), `décalage −1200 ms · auto 100 %`. Un toggle *micro / caméra* :
la texture de l'onde change (fine et propre / grossière). Boucle.

**Copie.** *Le son de la caméra, ou le vrai.* / *Camera sound, or the real one.*

**Kit.** `FileCard` audio (icône note), animation d'attache, `Toggle` du kit UI.

---

## ☐ 7 · « Votre timeline, pas notre export. » — 8 s

**Message.** Contre l'objection n°1 : on ne perd pas la main.

**Storyboard.** Le bouton `Exporter la timeline · Final Cut Pro ▾` se déplie : Final Cut
Pro, Premiere Pro, DaVinci Resolve. La timeline atterrit dans le NLE avec ses coupes ; une
lame de coupe est saisie et déplacée de quelques images, l'onde suit. Légende : *Chaque
coupe reste éditable.*

**Copie.** *Votre timeline, pas notre export.* / *Your timeline, not our export.*

**Kit.** `ExportButton` (split button du footer), menu qui se déplie, `NleTimeline`,
curseur main.

---

## ☐ 8 · « Ou juste la vidéo. » — 6 s

**Message.** Pour ceux qui ne montent pas : les MP4 montés, un par source.

**Storyboard.** Trois cartes fichier, trois ondes qui se contractent en même temps, trois
MP4 qui tombent dans un ZIP qui se ferme, `Tournage · 22 sept.zip`. Boucle.

**Copie.** *Ou juste la vidéo.* / *Or just the video.*

**Kit.** `FileCard`, contraction simultanée, icône ZIP.

---

## ☐ 9 · « Regarde avant d'exporter. » — 8 s

**Message.** La preview fluide et la timeline à trois états.

**Storyboard.** Une tête de lecture avance sur l'onde ; elle saute les bandes hachurées
sans à-coup (le temps affiché continue, l'onde « avale » la bande). En bas, la timeline à
trois états : gardé, silence, hésitation ivoire. Un scroll zoome sur une minute et chaque
coupe apparaît. Légende : *Gardé, silence, hésitation. Zoome sur une minute.*

**Copie.** *Regarde avant d'exporter.* / *Watch before you export.*

**Kit.** `Playhead`, saut de bande, timeline zoomable (deux niveaux de détail).

---

## ☐ 10 · « Tout se passe sur votre machine. » — 6 s

**Message.** Local, offline, rien n'est envoyé. Différenciant et sous-exploité.

**Storyboard.** Icône wifi qui s'éteint dans la barre de menus. Le traitement continue :
compteur qui tourne, barres qui se hachurent. Ligne : *Aucun fichier envoyé. Jamais.*
Boucle.

**Copie.** *Tout se passe sur votre machine.* / *Everything happens on your machine.*

**Kit.** Rien de neuf ; une icône wifi et le compteur.

---

## ☐ 11 · « Première fois. » — 10 s (landing plutôt que réseaux)

**Message.** Trois clics avant le premier résultat.

**Storyboard.** L'écran de bienvenue, une seule barre d'installation, l'app apparaît. Un
fichier glissé, *Traiter*, le résultat. Compteur de clics discret : 1, 2, 3.

**Copie.** *Première fois.* / *First time.* — légende : *Trois clics.* / *Three clicks.*

**Kit.** `WelcomeCard` (l'écran d'installation), dropzone, `FileCard`.

---

## Ordre conseillé

1. **#3 multicam drop** et **#7 timeline** : elles construisent `FileCard`, `GroupCard`,
   `NleTimeline` et `ExportButton`, dont le hero a besoin.
2. **#1 hero**, une fois ces briques là : c'est de l'assemblage plus les transitions.
3. Le reste par valeur marketing : #5, #10, #4, #9, #6, #8, #11.

## Ce que le kit doit gagner, tout compris

`FileCard`, `GroupCard`, `AngleTile`, `NleTimeline`, `ExportButton`, `StatCard`,
`WelcomeCard`, `CutBlade`, `Playhead`, une onde longue précalculée (canvas/path) qui
défile et se contracte, un mouvement de recalage réutilisable, des transitions de scène.
