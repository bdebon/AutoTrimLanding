# Landing AutoTrim v2 — brief

*24 septembre 2026, mis à jour le même jour avec les réponses de Benjamin (§8). Contrat pour la passe design puis l'implémentation. Structure et contenu
seulement : pas de maquette, pas de code de page. Les blocs de copie sont en FR et EN ; es/zh
seront traduits de l'EN après.*

Sources : la landing actuelle (`app/[locale]/page.tsx`, `components/`, `messages/{en,fr}.json`,
`public/pricing.md`), les capsules (`capsules/CAPSULES.md`, numéros #1 à #11), les vérités produit
de l'app (`AutoTrim/design/redesign-2026-09/SPEC-multicam.md`, ses chaînes d'interface, son
changelog), et les retours clients de l'été (James, Georgia, Craig, Maxime).

---

## 1. Positionnement

AutoTrim retire les silences et, en v2, les hésitations (« euh », « um ») des rushes filmés face
caméra, entièrement sur le Mac ou le PC de l'utilisateur, et lui rend une timeline éditable
(Final Cut Pro, Premiere Pro, DaVinci Resolve) ou les MP4 déjà montés. La v2 ajoute le multicam :
plusieurs caméras et micros d'une même prise se synchronisent seuls, un micro par personne, et un
montage automatique suit celui qui parle. Ce n'est pas un logiciel de montage : il prépare la
coupe, l'utilisateur la finit dans son outil, où chaque coupe reste à lui.

Une phrase : **Coupe les silences. Et les euh.** / *Cuts the silences. And the ums.* (c'est la
carte de fin de la capsule #1 ; on la garde partout.)

Ton : **vous**, comme la landing actuelle (décision de Benjamin). Les capsules pas encore
fabriquées aussi : les fiches #7 (*Votre timeline, pas notre export*) et #10 (*Tout se passe sur
votre machine*) de `capsules/CAPSULES.md` sont déjà corrigées. La copie FR de la #1 tutoyait
(*Ta timeline, prête*, *dans ton logiciel*) : corrigée dans `capsules/src/capsules/hero/copy.ts`,
**`hero-fr.mp4` est donc à re-rendre** ; la #2 ne tutoie pas. On écrit *votre machine*, jamais *votre Mac* : Windows reste supporté.

On ne parle pas des répétitions (reprises) sur la page : la fonction est cachée dans l'app.

## 2. Audiences, par ordre de priorité

Les trois veulent la timeline. Le MP4 direct est un chemin secondaire, pas un profil.

1. **Le YouTuber face caméra** (cœur). Une session de tournage, une heure de rushes, des dizaines
   de « euh ». Monte dans Final Cut (la majorité des acheteurs), Premiere ou Resolve.
2. **Le podcaster / interviewer** avec plusieurs caméras et micros. Ouvert par le multicam v2.
   Monte dans Resolve ou Premiere. C'est le profil de Craig et de Theo.
3. **Le formateur qui enregistre au prompteur** : des dizaines de prises, silences et hésitations
   à nettoyer, puis la timeline FCPX pour finir. Benjamin vient de le faire pour son propre cours
   (« fantastique »). Beaucoup d'enregistrements d'écran (OBS, VLC, QuickTime) : Maxime.

Objections à répondre sur la page, toutes traitées dans les sections 5 à 7 et la FAQ :

| Objection | Réponse sur la page |
|---|---|
| « Je perds la main sur la coupe » | Section 5 : timeline éditable, rien n'est effacé, chaque clip garde ses poignées |
| « Je dois uploader mes rushes » | Section 7 : tout en local, marche hors ligne, James en preuve |
| « Mon podcast a deux pistes » | Section 4 : un micro par personne, coupe seulement quand personne ne parle |
| « Ça coupe trop » | Section 6 : preview à trois états (gardé / silence / hésitation), les parties retirées s'écoutent, seuil ajustable puis retraitement |

## 3. Ce que dit la page aujourd'hui (inventaire)

Ordre réel dans `app/[locale]/page.tsx` :

| # | Composant | Namespace | Contenu | Sort v2 |
|---|---|---|---|---|
| 1 | `Hero.jsx` | `hero` | Badge « Save 96% », H1 « Stop wasting hours trimming silence », description qui finit sur CapCut, CTA « Try AutoTrim for free » → `/download` + « Watch a 90s Demo » → `#demo`, trois captures de l'ancienne UI (`hero-step-1/2/3.jpg`) | Refondu (capsule #1) |
| 2 | `SocialProof.jsx` | `socialProof` | Trois pastilles : « ≈ 29× faster », « Save ~46 min on 30 min », « 100% local & private » | Retiré ; les vrais chiffres passent dans le hero |
| 3 | `VideoDemo.jsx` | `videoDemo` | Démo Vimeo 90 s (`NEXT_PUBLIC_VIMEO_ID`), ancienne UI | Retiré : les capsules parlent d'elles-mêmes (décidé) |
| 4 | `TimeSavings.jsx` | `timeSavings` | « 48× faster », « 96% », cas client 30 min, note en français dans la version EN | Retiré |
| 5 | `Testimonials.jsx` | `testimonials` | Robin Servoisier, Izayi, Theo Won ; « Join 10,000+ » commenté | Gardé, complété (James, Georgia) |
| 6 | `ProcessSteps.jsx` | `processSteps` | Drop / Trim in parallel / One timeline, captures de l'ancienne UI | Retiré ; le hero montre le parcours |
| 7 | `WhyFaster.jsx` | `whyFaster` | Tableau « AutoTrim vs other tools » (48×), liens compare | Retiré de la landing ; les pages compare restent |
| 8 | `PerksGrid.jsx` | `perksGrid` | 12 cartes, « Loved by 10,000+ creators », badge EXPERIMENTAL sur les hésitations | Retiré ; chaque vérité utile est reprise dans une section ou la FAQ |
| 9 | `FAQ.jsx` | `faq` | 8 questions (Mac/Windows, NLE, local, réglages, hésitations « experimental », parallèle, audio, CapCut) | Réécrite |
| 10 | `FinalCTA.jsx` | `finalCTA` | « 5 h/semaine = 260 h/an, 96 % récupérés, 12 500 $ » | Retiré ; CTA final simple |
| — | `Header.tsx` | `nav` | Features / How it works / FAQ + « Download Free Trial » | Gardé, libellés revus |
| — | `Footer.tsx` | `footer` | Guides, compare, langues, « Ready to reclaim your time? » | Gardé (infra) |
| — | `/pricing` (`Pricing.jsx`) | `pricing` | Free / Monthly $15 / Annual $119 / Lifetime $149 (barré $279), garantie 14 j, 2 machines | Gardé, rhabillé (section 9) |

Le JSON-LD `Product` et `FAQPage` dans `page.tsx` répètent la FAQ (CapCut, « experimental ») : à
resynchroniser avec la FAQ v2. `metadata.description` mentionne « clips for CapCut ».

Hors périmètre, on n'y touche pas : guides, pages compare, sitemap, pages légales, pixels,
plomberie i18n, `/download`.

## 4. Ordre des sections

Chaque section : but, titre FR/EN, corps FR/EN, preuve, visuel, CTA. Les corps sont des
propositions de copie, à couper au design, pas à allonger.

### 4.1 Hero — capsule #1 en boucle, muette

**But.** Montrer en trente secondes ce que fait la v2 sur une vraie heure de rushes, et donner
les deux sorties : télécharger, voir le prix.

**Titre.** FR *Coupe les silences. Et les euh.* — EN *Cuts the silences. And the ums.*

**Corps.** FR *AutoTrim lit vos rushes sur votre machine, retire les silences et les
hésitations, et vous rend une timeline Final Cut Pro, Premiere Pro ou DaVinci Resolve où chaque
coupe reste à vous. Plusieurs caméras et micros ? Ils se calent seuls.* — EN *AutoTrim reads
your footage on your machine, takes out the silences and the hesitations, and hands back a Final
Cut Pro, Premiere Pro or DaVinci Resolve timeline where every cut is still yours. Several cameras
and mics? They line themselves up.*

**Preuve.** Une ligne de chiffres de la capsule, tabulaires, sous le titre : `59:45 → 39:57 ·
−33 % · 521 coupes` avec la mention *une vraie heure de rushes* / *a real hour of footage*. Ce
sont les 17 rushes OBS du 5 septembre 2025, analysés avec le pipeline de l'app.

**Visuel.** Capsule #1 (`Hero-fr` / `Hero-en`, 30 s, 16:9), en boucle, muette, poster PNG en
attendant. Sur mobile : le poster et un bouton lecture, pas d'autoplay.

**CTA.** Deux : **Télécharger AutoTrim** / **Download AutoTrim** (primaire, → `/download`) et
**Voir les tarifs** / **See pricing** (secondaire, → `/pricing`). Dessous, en petit : *macOS ·
Windows · tout en local* / *macOS · Windows · everything local*. Nom du CTA validé ; il se
répète tel quel dans `nav`, 4.5, le CTA final et le footer.

### 4.2 Silences — la base

**But.** Rassurer sur ce qui existe déjà et qui marche : le silence part, la respiration reste.

**Titre.** FR *Les silences partent d'abord.* — EN *Silences go first.*

**Corps.** FR *Le seuil se règle tout seul sur chaque fichier. Une marge est gardée de chaque
côté d'une phrase, pour que la coupe ne mange ni la première ni la dernière syllabe. Sur une
heure de rushes face caméra, un tiers du temps est du silence.* — EN *The threshold sets itself
for each file. A margin is kept on either side of a sentence, so a cut never clips the first or
last syllable. On an hour of talking-head footage, a third of it is silence.*

**Preuve.** PostHog (projet AutoTrim, event `clips_processed`, 12 derniers mois, sessions de
plus de 3 min et réductions entre 1 et 90 % pour écarter les tests) : **2 683 sessions, 584
utilisateurs, 2 489 heures de rushes, réduction médiane 33 %** (p25 20 %, p75 46 %) ; pondérée
par la durée, 41 % ; sur les sessions de plus de 45 min, médiane 39 %. Ces chiffres incluent les
sessions où l'IA v1 était activée, mais l'essentiel du retiré est du silence. Donc *un tiers*
se dit, et s'écrit : *Sur 2 500 heures de rushes traitées par AutoTrim, un tiers était du silence.*
/ *Across 2,500 hours of footage run through AutoTrim, a third was silence.* L'heure réelle de
la capsule (`59:45 → 40:20` avec les silences seuls, −32 %) tombe sur la médiane.

**Visuel.** Capture A : l'écran de session après traitement, les cartes de fichiers avec leurs
bandes hachurées et les stat cards (artboard `05-complete`). Pas de capsule dédiée.

**CTA.** Aucun.

### 4.3 Hésitations — le titre de la v2

**But.** Le nouveau : les « euh » partent, avec un modèle fait pour ça, en local.

**Titre.** FR *Euh.* — EN *Um.*

**Corps.** FR *Un modèle entraîné à repérer les hésitations, pas une transcription détournée :
il entend le « euh » qui traîne, le « hmm », le mot repris. Chaque hésitation est marquée sur
la timeline, vous la voyez, vous l'écoutez, elle part. Le tout sur votre machine, sans rien
envoyer.* —
EN *A model trained to spot hesitations, not a transcript bent to the task: it hears the
drawn-out "uhh", the "hmm", the word picked up again. Every hesitation is marked on the
timeline, you see it, you hear it, it goes. All on your machine, nothing uploaded.*

**Preuve.** `123 hésitations` retirées sur l'heure réelle (chiffre de la capsule #1). Le retour
de Georgia sur la v1 (le « eeeer » long échappait à la détection) est ce que la v2 corrige :
on peut l'écrire tel quel dans un encart *ce qui a changé* si elle donne son accord.

**Visuel.** Capsule #2 (`Euh-fr` / `Euh-en`, 8 s, en boucle).

**CTA.** Aucun.

### 4.4 Multicam — un drop, tout se cale

**But.** Ouvrir le profil podcast/interview. Un lecteur comme Craig doit se reconnaître dans
les trois phrases.

**Titre.** FR *Trois caméras, deux micros, un drop.* — EN *Three cameras, two mics, one drop.*

**Corps.** FR *Déposez tous les fichiers d'une prise. Ils se retrouvent par leur son et se calent
à l'image près, même si une caméra a démarré en retard, s'est coupée en deux fichiers ou dérive.
Un micro par personne : on ne coupe que quand personne ne parle, jamais deux voix à la fois, et
le « euh » de l'un n'est retiré que si l'autre se tait. Le montage suit celui qui parle, plan
large quand tout le monde parle.* — EN *Drop every file of one take. They find each other by
their sound and line up to the frame, even when a camera started late, split into two files or
drifts. One mic per person: a cut only when nobody speaks, never two voices at once, and one
person's "um" only goes if the other is silent. The edit follows who's talking, wide shot when
everyone does.*

**Preuve.** Theo Won (déjà sur la page) : *2–3 heures de podcast à plusieurs, au moins 2 h de
montage gagnées par épisode*. Vérité produit : la timeline exportée empile les angles (V1 =
angle principal, les autres au-dessus désactivés, une piste par micro), toutes coupées aux mêmes
instants, dans Resolve, Final Cut et Premiere.

**Visuel.** Trois capsules en colonne ou en onglets : #3 (le drop, 10 s), #4 (*Chaque micro, sa
voix*, 8 s), #5 (*Le montage suit celui qui parle*, 10 s). Si une seule : #3.

**CTA.** Aucun.

### 4.5 « Votre timeline, pas notre export » — objection n° 1

**But.** Tuer la peur de perdre la main. Le plus important après le hero.

**Titre.** FR *Votre timeline, pas notre export.* — EN *Your timeline, not our export.*

**Corps.** FR *Une timeline, tous vos fichiers bout à bout, dans Final Cut Pro, Premiere Pro ou
DaVinci Resolve. Rien n'est effacé : chaque clip garde ses poignées, tirez un bord pour récupérer
une respiration. AutoTrim ne monte pas à votre place, il prépare la coupe.* — EN *One timeline,
all your files end to end, in Final Cut Pro, Premiere Pro or DaVinci Resolve. Nothing is erased:
every clip keeps its handles, drag an edge to bring a breath back. AutoTrim doesn't edit for
you, it preps the cut.*

**Preuve.** C'est la phrase du menu d'export de l'app, mot pour mot. Les trois logos NLE (assets
officiels à vérifier avant usage, note du `HANDOFF.md` de l'app).

**Visuel.** Capsule #7 (8 s : le menu d'export se déplie, la timeline atterrit dans le NLE, une
coupe est déplacée de quelques images). Capture B en secours : le menu d'export ouvert (artboard
`05b-export-menu`).

**CTA.** **Télécharger AutoTrim** en rappel discret sous la section.

### 4.6 Preview et MP4 direct — plus court

**But.** Deux vérités en une section courte : on voit avant d'exporter, et on peut se passer de
timeline.

**Titre.** FR *Regarde avant d'exporter.* — EN *Watch before you export.*

**Corps.** FR *La lecture saute les coupes sans à-coup. La timeline montre trois états : gardé,
silence, hésitation. Un doute ? Écoutez ce qui a été retiré, ajustez le seuil, relancez. Vous
ne montez pas ? Prenez la vidéo déjà coupée, un MP4 par source, ou un clip par coupe.* — EN
*Playback skips the cuts without a stutter. The timeline shows three states: kept, silence,
hesitation. Not sure? Listen to what was removed, adjust the threshold, run again. Don't edit?
Take the video already cut, one MP4 per source, or one clip per cut.*

**Preuve.** Izayi (déjà sur la page) : *des previews qui aident beaucoup*. Vérité produit : les
trois états sont ceux de l'app (Gardé / Silences / Hésitations).

**Visuel.** Capsule #9 (8 s) en principal, capsule #8 (*Ou juste la vidéo*, 6 s) en petit à côté.
Capture C en secours : la preview avec sa timeline à trois états (artboard `04-preview`).

**CTA.** Aucun.

### 4.7 Local et privé

**But.** Le différenciant sous-exploité : rien ne part, ça marche avec une mauvaise connexion.

**Titre.** FR *Tout se passe sur votre machine.* — EN *Everything happens on your machine.*

**Corps.** FR *Aucun fichier envoyé, jamais. Les modèles sont téléchargés une fois, puis AutoTrim
travaille hors ligne. Une heure de rushes en 4K ne transite nulle part : pas d'upload à attendre,
pas de rushes clients sur un serveur.* — EN *No file uploaded, ever. The models download once,
then AutoTrim works offline. An hour of 4K footage goes nowhere: no upload to wait for, no client
footage on a server.*

**Preuve.** James : monte dans Final Cut à la main, a essayé Descript et OpusClip mais a une
connexion DSL et l'upload est *une énorme perte de temps* ; AutoTrim lui fait gagner 1 à 2 h par
projet. **Permission explicite de le citer.**

**Visuel.** Capsule #10 (6 s : le wifi s'éteint, le traitement continue).

**CTA.** Aucun.

### 4.8 Témoignages

Prénoms seuls pour les nouveaux ; les trois existants gardent leur nom tel qu'affiché
aujourd'hui.

| Qui | Citation (à raccourcir au design) | Sert de preuve à | Permission |
|---|---|---|---|
| **James**, monteur Final Cut | Essayé Descript et OpusClip ; avec sa DSL, l'upload est une énorme perte de temps. AutoTrim lui économise 1 à 2 heures par projet. | Local (4.7), temps gagné | **Oui, explicite** |
| **Georgia** | Montait à la main avec des automatisations Stream Deck, toujours pénible. *« Realistically it saved me days. »* Une vidéo de 4 h 45 montée en 2 heures pour 1 h de final. Prévoit une vidéo et un lien affilié. | Temps gagné ; angle *ce qui a changé en v2* (le « eeeer » long, la synchro audio/vidéo qui ne marchait pas : les deux sont corrigés par le modèle d'hésitations et le regroupement par corrélation audio) | **À confirmer avant publication** (a répondu à la demande de citation, accord probable) |
| **Theo Won**, podcaster | Épisodes de 2–3 h à plusieurs, 2 h de montage gagnées par épisode | Multicam (4.4) | Déjà publié |
| **Robin Servoisier**, monteur pro | *« J'ai essayé d'autres outils, aucun ne fonctionnait vraiment »*, UX propre, 1 h par projet | Objection *j'ai déjà essayé* | Déjà publié |
| **Izayi**, monteur freelance | Vitesse, previews qui aident | Preview (4.6) | Déjà publié |

Pas des témoignages, mais des retours qui ont façonné la page :

- **Craig** (interviews podcast, deux pistes). Demandait exactement : *quand un mot de
  remplissage est retiré d'une piste, retirer le même passage de l'autre seulement si elle est
  silencieuse*, et un moyen de voir ce qui a été supprimé. Remboursé. La section 4.4 est écrite
  pour qu'il s'y reconnaisse, et la 4.6 répond à sa deuxième demande. Voir *lancement*.
- **Maxime** (enregistrements d'écran VLC de 30 min, bugs d'export média depuis corrigés). Rappel
  que les cours enregistrés à l'écran sont un vrai usage : la FAQ dit que les enregistrements à
  fréquence d'images variable sont pris en charge (corrigé en 0.6.12).

### 4.9 Tarifs, FAQ, pied de page

**Tarifs.** Les prix changent avec la v2 (décision de Benjamin, montants à arrêter). Cadre
proposé, à trancher avant la passe design car il change la page :

| Plan | Aujourd'hui | Proposé v2 | Rôle |
|---|---|---|---|
| Free | $0, tout sauf l'export | inchangé | L'essai, sans limite de temps |
| Pass mensuel | $15 / mois | $19 / mois | Assumé comme *pass projet* (durée médiane réelle : 1 mois) |
| Annual | $119 / an | retiré de la page | 1 vente en un an ; le garder dans le checkout si un client le demande |
| Lifetime | $149 « prix de lancement », barré $279 depuis 3 ans | **$249**, avec une vraie fenêtre à $149 jusqu'à une date imprimée | Le produit qui se vend (23 des 69 commandes, LTV mensuel ≈ $28) |

Règle : la landing v2 n'affiche plus jamais un prix barré sans date. Pendant la fenêtre de
lancement, la carte Lifetime dit *$149 jusqu'au [date] · ensuite $249* ; après, *$249* sans
barré. Les détenteurs Lifetime actuels ont la v2 incluse (mises à jour à vie promises) : à dire
sur la page pricing, c'est un argument. Les abonnés actuels reçoivent l'offre de passage à
Lifetime $149 moins ce qu'ils ont déjà payé (mécanique du winback existant), même date butoir.

Communs : 14 jours remboursés, 2 machines, Lemon Squeezy. Titre : FR *Gratuit pour essayer.
Payant pour exporter.* — EN *Free to try. Pay to export.* On retire « Priority export speed »
(`pricing.plans.*.features`, ça ne veut rien dire pour une app locale) et le placeholder
`pricing.trial.description` (« X days »). Les fichiers à tenir en cohérence le jour J :
`messages/*.json` (`pricing.*`), `public/pricing.md`, `public/llms.txt`, le JSON-LD `Product`
si une offre y est ajoutée, et les campagnes Customer.io / lemlist qui citent $149.

**FAQ v2** (remplace les 8 actuelles ; réponses de deux phrases, chacune déjà vraie dans l'app) :

1. Mac et Windows ? Oui, pas de Linux.
2. Final Cut, Premiere, Resolve ? Oui : FCPXML pour Final Cut et Resolve, XML pour Premiere, une
   seule timeline, chaque clip garde ses poignées.
3. Mes fichiers quittent-ils mon ordinateur ? Non, jamais ; les modèles sont téléchargés une fois.
4. Ça coupe trop ? Preview à trois états, les parties retirées s'écoutent, seuil ajustable et
   retraitement.
5. Mon podcast a un micro par personne ? Oui : coupe seulement quand personne ne parle, jamais
   deux voix, hésitation retirée seulement si l'autre se tait.
6. Plusieurs caméras ? Synchro à l'image par le son, angles empilés dans la timeline, montage
   auto en preview.
7. Dans quelles langues les hésitations sont-elles détectées ? Le modèle de la v2 annonce une
   dizaine de langues dans sa documentation (CrisperWhisper 2) ; liste exacte à confirmer avant
   d'écrire la réponse, et on ne nomme pas le modèle sur la page.
8. Enregistrements d'écran (OBS, VLC, QuickTime), fréquence d'images variable ? Pris en charge,
   la durée réelle est conservée.
9. Pas de logiciel de montage, ou CapCut ? Vidéo déjà coupée en MP4, un par source, ou un clip
   numéroté par coupe à glisser dans CapCut.
10. Audio seul ? Oui, même traitement, export AAC ou timeline.
11. Que comprend le gratuit ? Tout, sans limite de temps ; seul l'export demande une licence.
12. Combien de machines, remboursement ? 2 machines, 14 jours.

**Pied de page.** Inchangé (guides, compare, langues), sauf le CTA `footer.cta.*` aligné sur le
nom du CTA principal. Un CTA final au-dessus : titre + les deux boutons du hero, rien d'autre
(pas de calcul d'heures ni de dollars).

## 5. Ce qu'on retire ou rétrograde

Tout est listé par clé pour que l'implémentation n'ait rien à interpréter.

**Retiré de la page** (les clés peuvent être supprimées de `messages/*.json` une fois v2 en
ligne) :

- `hero.badge` « Save 96% of your editing time » : chiffre invérifiable ; remplacé par les
  chiffres de l'heure réelle.
- `hero.description` : la fin « On CapCut? Get clips ready to drop in » ; CapCut ne sort plus du
  hero.
- `hero.steps.*`, `hero.images.*`, `hero.arrows.*`, `hero.tagline`, `hero.subTagline` et les
  images `public/assets/img/hero-step-{1,2,3}.jpg` : ancienne UI, remplacées par la capsule #1.
  `hero.images.processing` dit encore « Trimly ».
- `hero.cta.secondary` « Watch a 90s Demo » et la section `videoDemo.*` (`VideoDemo.jsx`,
  `NEXT_PUBLIC_VIMEO_ID`) : la démo montre l'ancienne UI ; le hero devient la démo.
- `socialProof.stats.*` (« ≈ 29× faster », « ~46 min on 30 min ») : chiffres de v1 non
  reproductibles.
- `timeSavings.*` en entier (« 48× », « 96% », « 97.9% reduction », note FR dans la version EN).
- `whyFaster.*` (tableau « vs other tools », « 48× faster ») : reste sur les pages compare.
- `processSteps.*` : trois captures de l'ancienne UI.
- `perksGrid.*` en entier, dont :
  - `perksGrid.lovedBy` « Loved by 10,000+ creators worldwide » et `testimonials.joinUsers`
    « Join 10,000+ » : faux (une trentaine d'utilisateurs actifs par semaine, 63 commandes payées).
    À retirer partout, y compris `public/llms.txt` si repris.
  - `perksGrid.perks.repetitionRemover` « Repetition & Hesitation Remover » avec badge
    EXPERIMENTAL : les hésitations sont le titre de la v2 ; la suppression des répétitions
    (reprises) est cachée derrière un mot secret dans l'app, donc **on ne la promet pas** sur la
    page. Même chose pour les mentions « repetition » dans `hero.description`,
    `hero.steps.step2.title` et `metadata.*`.
  - `perksGrid.perks.xmlExport` « Single or Multi-XML » : contredit la règle produit *une session,
    une timeline*.
  - `perksGrid.perks.directRender` « MP4, MP3 or CapCut-ready clips » : devient la moitié de 4.6,
    CapCut seulement en FAQ.
  - `perksGrid.perks.audioVideoSync` : absorbé par le multicam (4.4).
  - `perksGrid.perks.localProcessing`, `blazingPreview` : deviennent 4.7 et 4.6.
  - `perksGrid.perks.parallelProcessing`, `optimizedPro`, `smartPresets`, `dragDrop`,
    `multilingual`, `fineTune` : détails d'app, pas des arguments ; `fineTune` et `multilingual`
    survivent en FAQ.
- `finalCTA.*` (« 5 hours/week », « 260 hours », « $12,500 ») et `stillNotSure.*` : maths
  inventées.
- `faq.questions.4` « still experimental » : faux en v2. `faq.questions.7` (CapCut) : rétrogradé
  en question 9.
- `ai.*` (« coming soon »), `roadmap.*` (« 🔜 v2.0 »), `whyAutoTrim.*`, `features.*`,
  `howItWorks.*`, `whoIsItFor.*`, `timeComparison.*` : namespaces d'anciennes sections, aucun
  composant ne les affiche plus ; à supprimer avec leurs composants (`Features.jsx`,
  `HowItWorks.jsx`, `WhoIsItFor.jsx`, `TimeComparison.jsx`, `WhyAutoTrim.jsx`).
- `metadata.title` « | Free Trial » et `metadata.description` « or clips for CapCut » : à
  réécrire sur le positionnement (silences, euh, multicam, timeline, local).
- `public/llms.txt` ligne 10 (« 48× faster, about 96% of rough-cut time saved ») : remplacer par
  les chiffres de l'heure réelle ; `public/pricing.md` est déjà propre.
- Dans `page.tsx` : le JSON-LD `FAQPage` (CapCut, « experimental ») et `description` du
  `Product` (« filler words ») : à resynchroniser avec la FAQ v2. L'image OG
  `hero-screenshot.jpg` (ancienne UI) : à remplacer par le poster de la capsule #1.

**Rétrogradé** : CapCut (FAQ 9 seulement), les MP4 directs (moitié de 4.6), la synchro
vidéo + audio d'un seul fichier (cas particulier du groupe, dans 4.4 et FAQ 6), le tableau
comparatif (pages compare et footer).

**Gardé tel quel** : `/download` et ses notes Windows, `/pricing`, footer, guides, compare,
`docs/tracking.md` et les events `cta_clicked` / `section_viewed` (à reposer sur les nouvelles
sections avec les mêmes noms).

## 6. Assets nécessaires

**Capsules** (rendues dans `public/capsules/`, MP4 H.264 + WebM + poster PNG, FR et EN ; es/zh
lisent l'EN) :

| Section | Capsule | État |
|---|---|---|
| 4.1 Hero | #1 Hero, 30 s | ☑ faite |
| 4.3 Hésitations | #2 « Euh. », 8 s | ☑ faite |
| 4.4 Multicam | #3 drop 10 s, #4 « Chaque micro, sa voix » 8 s, #5 « Le montage suit celui qui parle » 10 s | ☐ (#3 a sa scène de base dans `src/capsules/multicam/`) |
| 4.5 Timeline | #7 « Votre timeline, pas notre export », 8 s | ☐ |
| 4.6 Preview / MP4 | #9 « Regarde avant d'exporter » 8 s, #8 « Ou juste la vidéo » 6 s | ☐ |
| 4.7 Local | #10 « Tout se passe sur votre machine », 6 s | ☐ |
| — | #6 (son caméra / vrai son) et #11 (« Première fois ») | Pas sur la landing v2 |

Ordre de fabrication conseillé par `CAPSULES.md` : #3 et #7 d'abord (ils construisent
`FileCard`, `GroupCard`, `NleTimeline`, `ExportButton`), puis #5, #10, #4, #9, #8. Si le temps
manque au lancement : une capture remplace la capsule dans 4.4, 4.5 et 4.6 (captures A à D).

**Captures de l'app v2 packagée** (à prendre plus tard, sur l'app livrée, fenêtre ~1280 px,
Retina 2×, email de licence masqué, session nommée, données réelles) :

- **A.** L'écran de session terminé : cartes coupées avec bandes hachurées, stat cards du récap
  (`05-complete`). Pour 4.2.
- **B.** Le menu d'export ouvert sur *Timeline · Final Cut Pro*, avec la phrase *rien n'est
  effacé* (`05b-export-menu`). Pour 4.5 en secours et pour l'OG de `/pricing`.
- **C.** La preview d'un fichier : timeline à trois états, compteur *Coupé 19:25* (`04-preview`).
  Pour 4.6.
- **D.** Une carte de groupe multicam après coupe, *3 angles · 2 micros*, *coupe seulement quand
  personne ne parle* (`m2-groupe-coupe`), ou la preview mosaïque (`p2-preview-multicam`). Pour
  4.4 en secours.

Plus : le poster de #1 en image OG (1200×630, recadré), les trois logos NLE officiels (droits
d'usage à vérifier), les photos de James et Georgia si elles acceptent (sinon initiales sur
tuile accent, pas d'avatar générique).

## 7. Lancement

- La landing part **le même jour que la v2** de l'app. Rien de v2 n'est visible avant : la page
  actuelle reste en ligne jusque-là, sans retouche.
- **Locales** : FR et EN d'abord (ce brief) ; es et zh traduits de l'EN après, dans la même PR
  ou la suivante, jamais en laissant les anciennes clés es/zh sous les nouvelles sections. Les
  capsules existent en FR et EN ; es/zh lisent les rendus EN.
- **Ce qui doit être vrai le jour J** : l'app affiche les hésitations sans mention
  « expérimental », le multicam et la preview mosaïque sont dans la build publique, l'export
  empilé s'ouvre dans les trois NLE (le `SPEC-multicam.md` de l'app garde une question ouverte
  sur l'import FCPXML de Resolve : à vérifier avant d'écrire « Resolve » dans 4.4).
- **Pages compare et guides** : elles gardent leurs chiffres v1 (« 48× ») le jour J ; passe de
  relecture la semaine suivante pour retirer « experimental » et « 10,000+ » partout.
- **Win-back Craig** : un mail personnel de Benjamin le jour de la sortie, pas une séquence :
  *les deux choses que tu demandais sont dans la v2 (la coupe d'un mot sur une piste seulement si
  l'autre se tait, et la preview de ce qui a été retiré) ; voilà un lien, dis-moi si ça marche
  sur tes épisodes*. Même mail, adapté, aux abonnés churnés qui ont cité le multicam ou les
  hésitations dans leur exit survey.
- **Georgia** : Benjamin lui demande l'accord de citation, en lui proposant en même temps le
  lien affilié qu'elle évoquait ; James est déjà OK.
- **Prix** : la hausse Lifetime est annoncée *avant* la v2 aux abonnés et aux anciens clients
  (mail perso + séquence Customer.io), avec la date butoir ; le jour J, la landing et `/pricing`
  affichent la fenêtre $149 → $249 avec la date ; à la date, on change les fichiers listés en
  4.9 et le prix Lemon Squeezy le même jour.
- **Mesure** : garder `cta_clicked` (`location` = hero / timeline / pricing / final) et
  `section_viewed` sur chaque section, pour comparer le hero v2 au taux actuel visiteur → clic
  téléchargement (12 %).

## 8. Décisions et questions restantes

Réponses de Benjamin du 24 septembre, appliquées dans ce brief :

| # | Question | Décision |
|---|---|---|
| 1 | Prix | **Ils bougent avec la v2.** Lifetime vers $249 après une fenêtre à $149 offerte aux abonnés et anciens clients. Montants exacts, date butoir et sort du plan annuel : **à arrêter** (proposition en 4.9). |
| 2 | Chiffre moyen de silences | **Sorti de PostHog** : médiane 33 % sur 2 683 sessions, 2 489 heures (4.2). |
| 3 | Georgia | Benjamin lui demande. **En attente.** |
| 4 | Nom du CTA | *Télécharger AutoTrim* / *Download AutoTrim*. |
| 5 | Tu ou vous | **Vous**, toujours. Copie FR réécrite ; fiches #7 et #10 des capsules corrigées. |
| 6 | Démo 90 s | **Retirée.** Les capsules parlent d'elles-mêmes ; une démo v2 pourra revenir plus tard. |
| 7 | Langues des hésitations | CrisperWhisper 2, une dizaine de langues selon sa doc. **Liste exacte à confirmer** avant d'écrire la FAQ 7 et de promettre la même chose en es/zh. |
| 8 | Ton Mac / ta machine | **Votre machine.** |
| — | Répétitions | On n'en parle pas. |

Reste à trancher avant la passe design : les montants et la date de la fenêtre de prix (4.9),
l'accord de Georgia, la liste des langues.
