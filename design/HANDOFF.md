<!-- Copy of AutoTrim/design/redesign-2026-09/HANDOFF.md, synced by design/sync-design.sh on 2026-09-24. Do not edit here. -->

# AutoTrim — passer les maquettes dans le code

## Ce qu'il faut mettre dans le repo

```
design/redesign-2026-09/
  tokens.css              ← autotrim-tokens.css, renommé
  HANDOFF.md              ← ce fichier
  artboards/
    01-upload.dc.html
    02-queue.dc.html
    03-processing.dc.html
    04-preview.dc.html
    04b-review.dc.html
    05-complete.dc.html
    05b-export-menu.dc.html
    06-settings.dc.html
    07-license.dc.html
    08-update.dc.html
    09-customize-context.dc.html
    10-customize-panel.dc.html
    multicam/               ← voir SPEC-multicam.md
```

Les artboards s'exportent depuis le canvas. Ce sont des fichiers HTML lisibles :
chaque valeur (hex, padding, rayon, taille) y est en clair. Ils ne s'ouvrent pas
dans un navigateur tel quel — ils référencent `support.js` et une balise `<x-dc>`
propres à l'éditeur de canvas. Ils servent de **source de valeurs**, pas de code
à copier.

## Le prompt à coller

> Dans ce repo, implémente le redesign décrit dans `design/redesign-2026-09/`.
>
> Commence par lire `HANDOFF.md`, puis `tokens.css`, puis les artboards dans
> l'ordre. Les artboards sont des maquettes : tu en extrais les valeurs, tu ne
> copies pas leur markup (ils sont en styles inline parce que l'éditeur de
> design l'impose — dans l'app, tout passe par les tokens et des composants).
>
> Crée une branche `redesign/dark-warm`. Ne touche ni au pipeline de traitement,
> ni à la détection de silence, ni à l'export XML/FCPXML, ni à la logique de
> licence. C'est un changement de présentation uniquement.
>
> Ordre de travail, un commit par étape :
> 1. `tokens.css` intégré et branché sur le thème existant
> 2. les composants partagés (liste ci-dessous)
> 3. les écrans, dans l'ordre 1 à 5
> 4. les modales 6 à 8
> 5. le panneau Customize 9 et 10
>
> Arrête-toi après l'étape 2 et montre-moi les composants avant d'attaquer les
> écrans.

Ce dernier point compte : les dix écrans sont le **même** petit jeu de
composants répété. Si tu laisses Claude reconstruire chaque écran
indépendamment, tu obtiens dix implémentations qui divergent et tu passeras
plus de temps à les réconcilier qu'à les écrire.

## Les composants partagés

Tout est bâti là-dessus. Rien d'autre n'est nécessaire.

| Composant | Où il sert |
|---|---|
| `Rail` | barre latérale 72 px, 3 entrées + réglages + avatar |
| `TopBar` | titre + sous-titre à gauche, contrôles en pilules à droite |
| `Chip` | pilule 34 px — statique, menu déroulant, ou interrupteur |
| `Switch` | piste 34×20, pastille 14 px — le contrôle AI cleanup |
| `StatCard` | libellé en capitales + valeur en display |
| `FileRow` | poignée, index rond, nom, méta, statut, actions |
| `Waveform` | colonnes à trois états (gardé / silence / hésitation) |
| `Button` | pilule : `primary` accent, `ghost` contour, `quiet` sans bordure |

## Les règles qui ne se voient pas sur les maquettes

- **L'app ne change jamais la forme de ce que l'utilisateur est en train de
  regarder.** Seul l'utilisateur replie, déplie, ajoute ou change d'écran. Un
  changement de forme provoqué par son clic, au moment de son clic, est permis
  (les cartes prennent leur hauteur réservée au clic sur « Traiter »). Rien ne
  se replie, ne s'insère au-dessus ou ne grandit tout seul ensuite. La fin de
  session n'est pas un écran : c'est l'état final de l'écran de liste. Voir
  `REPONSE-fin-de-session.md`.
- **Une session produit une seule timeline.** Tout le vocabulaire le dit : on
  écrit « Exporter la timeline », jamais « Exporter N timelines ». L'export d'un
  fichier seul existe mais vit dans le menu `⋯` de la carte ; le seul bouton
  d'export visible est celui de la timeline complète. C'est la différence
  produit avec la concurrence : ne jamais laisser un libellé suggérer N projets
  à fusionner.

- **Texte foncé sur l'accent, jamais blanc.** Blanc sur `#FF5B2E` tombe à 3,7:1.
- **Le playhead est blanc chaud, pas orange.** Il passe sur des barres orange.
- **Les cases et radios restent natives**, stylées par `accent-color`. Ne pas les
  reconstruire en div : le clavier et VoiceOver s'y perdent.
- **L'état est porté par la bande, jamais par les barres.** C'est la règle la
  plus importante du fichier, et c'est celle qu'on a cassée au premier essai.
  Un silence n'a pas de barre : encoder « retiré » sur les barres revient à
  l'encoder sur une marque absente précisément là où l'état compte. On dessine
  d'abord la bande, les barres par-dessus.
- **Le retiré est plus clair que le fond, et hachuré.** Les hachures survivent
  au daltonisme, au niveaux de gris et à un screenshot compressé ; la
  différence de luminance rend la chose visible d'un coup d'œil. Il faut les
  deux. Un delta de 1 % entre les deux fonds ne se voit pas sur un écran noir.
- **Une hachure par bande, pas par colonne.** Un motif redémarré sur chaque
  colonne de 4 px se lit comme du bruit.
- **La largeur des barres est fixe en pixels, pas dérivée du nombre
  d'échantillons.** Environ 4 px de barre pour 3 px de gouttière, et c'est le
  nombre de barres qui se déduit de la largeur disponible et du zoom — jamais
  l'inverse. Des barres en `flex-grow: 1` collées les unes aux autres lisent
  comme un graphique en bâtons, et surtout elles recouvrent les hachures des
  zones coupées. L'implémentation actuelle a raison sur ce point, les
  artboards l'ont eu faux un moment : leurs données de démo sont à basse
  résolution, ce n'est pas une spec.
- **Les barres et les bandes partagent la même fonction temps → x.** Avec une
  gouttière entre les barres, le centre d'une barre ne tombe plus au même
  endroit qu'une position calculée en pourcentage : les deux grilles doivent
  être dérivées du même mapping, sinon les bandes se décalent des barres aux
  extrémités.
- **La carte montre un extrait de 60 s, pas le fichier entier.** Au-delà d'une
  minute, la vue complète fait plusieurs secondes par barre : les coupes passent sous
  le pixel et tout devient un mur plein. Extrait choisi par la règle de
  `REPONSE-fin-de-session.md` §3, fichier entier rappelé dans une bande de 4 px sous
  la waveform. Pendant l'analyse, en revanche, on montre le fichier entier en gris et
  le balayage le colore : c'est une progression, pas un résultat.
- **Largeur minimale de 3 px** sur toute bande et tout marqueur. Une coupe
  d'hésitation de 0,3 s dans un fichier de 24 minutes en vue complète fait une
  fraction de pixel : sans plancher, elle n'existe pas à l'écran.
- **Le silence et l'hésitation partagent le même traitement de bande.** Sur des
  données réelles il y a 401 silences pour 5 hésitations — la distinction se
  fait dans la voie de marqueurs au-dessus, pas dans la bande, qui n'a que deux
  états : gardé, retiré.
- **Trois types de coupe, un seul accent.** Silence, hésitation et répétition se
  distinguent par leur marqueur (bloc gris, pastille accent, pastille ivoire
  `#EDE3D6` avec guillemets), jamais par une teinte de bande. Pas de bleu. Détail
  dans `SPEC-nom-de-session-et-repetitions.md`.
- **Le titre de la barre du haut est le nom de la session, le statut est dans le
  sous-titre.** Voir la même spec.
- **L'audio lié et le multicam sont le même objet : le groupe.** Un groupe a un son
  principal (écouté en preview, jamais le son témoin de la caméra) et un angle
  principal (V1 à l'export). Voir `SPEC-multicam.md`.
- **Pas d'emoji comme glyphe d'interface.** SVG en stroke uniquement.
- **Un seul accent.** Si un élément a besoin d'une deuxième couleur, c'est
  généralement qu'il a besoin d'une autre hiérarchie.

## Ce qui reste à trancher

- `[YOUR SECOND EXPORT MODE]` dans l'écran 6 — le deuxième mode d'export
  vidéo/audio, coupé dans la capture d'origine.
- `[MODEL SIZE]` dans l'écran 3 — la taille du modèle CrispWhisper à afficher
  pendant le téléchargement en tâche de fond.
- Les logos Resolve / Final Cut / Premiere de l'écran 5 sont des glyphes
  neutres. Il faut les assets officiels, et vérifier leurs conditions d'usage
  avant de les mettre dans une pub.
- L'email visible dans la modale de licence est réel. À remplacer par une
  adresse neutre avant tout screenshot de campagne.

## Bugs repérés dans les captures, indépendants du design

- Le changelog de la popup de mise à jour affiche son markdown brut
  (`**export:**`) et contient une entrée en double.
- La modale de licence est en français alors que le reste de l'app est en
  anglais.
- Deux chaînes françaises dans les previews du panneau Customize
  (« 5 silences fusionnés », « 8 segments supprimés »).
