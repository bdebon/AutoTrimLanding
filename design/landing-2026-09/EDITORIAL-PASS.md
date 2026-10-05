# Passe éditoriale du 25 septembre 2026

Cette note complète le brief du 24 septembre à partir de la demande de Benjamin, de l’ancienne landing et du code actuel. La conversation et cette passe remplacent les anciennes consignes concernant le bloc « Différences » et la mise en avant des licences.

## Direction

La promesse reste de récupérer du temps pour monter. La v2 l’étend à un tournage entier, aux hésitations et aux conversations à plusieurs caméras et micros. Les fonctionnalités expliquent le bénéfice au moment où le visiteur le voit ; elles ne composent pas une liste de supériorités supposées sur les concurrents.

Benjamin a observé des départs à la découverte des prix dans les sessions replay PostHog. Décision : encourager l’essai sur les vrais rushes avant le prix. Observation rapportée par Benjamin, pas une nouvelle analyse PostHog ni une causalité mesurée pendant cette passe. Pas de pricing sur la home, pas de CTA vers les licences dans le parcours. Les tarifs restent accessibles au footer. La FAQ précise toujours que l’export nécessite une licence ; traitement et preview sont gratuits.

## Ce que l’ancienne landing apportait

Référence : commit `63cfe15`, avant la refonte, notamment `messages/fr.json`, `components/TimeSavings.jsx`, `components/PerksGrid.jsx` et l’ordre de `app/[locale]/page.tsx`.

- Le temps récupéré était le sujet principal, dès le titre.
- « Glisser. Déposer. Terminé. » rendait le parcours facile à comprendre.
- Traitement parallèle, tous les clips dans une seule timeline, retour à son éditeur : bénéfices concrets qui restent essentiels en v2.
- Réglages des coupes, absence d’upload et export direct : des réponses pratiques aux hésitations avant l’essai.
- Les chiffres historiques variaient selon les blocs (29×, 48×, 96 %). Ils ne sont pas réintroduits sans une mesure actuelle comparable.
- Les pourcentages de rushes retirés ne mesurent pas le temps de travail du monteur. Conserver cette distinction.

## Inventaire des ajouts du code actuel

App examinée jusqu’au commit `d785d50`, avec les modifications locales présentes. Lecture du code et de l’historique, sans exécuter une nouvelle validation fonctionnelle de l’app ni modifier ses fichiers.

| Évolution | Preuve dans le repo AutoTrim | Conséquence éditoriale |
|---|---|---|
| Détection des hésitations avec CrisperWhisper 2 | `011d0e0`, `backend-rust/autotrim-core/src/ai/fillers.rs` | Promouvoir le nettoyage des « euh ». Éviter la digression sur l’architecture du modèle. |
| Preview fluide et timeline zoomable | `7ebbcd2`, `1bc6763`, `d5f8cde`, `frontend/src/components/VideoPreview.tsx` | Écouter, inspecter et ajuster avant l’export. |
| Une session nommée, ses fichiers dans l’ordre, un export commun | `e5f93dc`, `fb3220a`, `frontend/src/components/queue/ExportMenu.tsx` | Tous les rushes deviennent une timeline à reprendre dans son logiciel habituel. |
| MP4 par source, clips séparés, export audio | `2bb1e6a`, `frontend/src/components/queue/ExportMenu.tsx` | Chemin secondaire pour ceux qui veulent la vidéo nettoyée ou continuent dans CapCut. |
| Synchro de plusieurs angles et micros, gestion des décalages et dérives | `e299033`, `59091b6`, `backend-rust/autotrim-core/src/multisync.rs` | Un tournage multicam se prépare ensemble. |
| Filtrage des candidats à la synchro et question « enregistrés ensemble ? » | `475ab71` | Éviter de promettre que n’importe quels fichiers se synchronisent sans intervention. |
| Matching par plusieurs indices, y compris pour les pistes isolées sans son commun | `475ab71`, `multisync.rs` (`MediaFacts`, sélection des candidats, `started_together`, `dated_group`) | Mettre en avant la reconnaissance des fichiers d’une même prise par le son, la durée, les heures et métadonnées. Le cas Riverside fait partie du discours principal ; les groupes à vérifier sont expliqués en FAQ. |
| Coupe commune seulement quand personne ne parle ; hésitations protégées si une autre voix parle | `49c5ef0` | Une pause individuelle ne supprime pas la parole d’un autre invité. |
| Carte de groupe et ajustement manuel de la synchro | `b3446e7`, `frontend/src/components/queue/GroupCard.tsx` | Vérifier et corriger reste possible. |
| Mosaïque multicam, angle plein écran, mute/solo des micros | `116a3b4`, `bc02484`, `frontend/src/components/VideoPreview.tsx` | Vérifier les angles ensemble et écouter un micro seul. |
| Suivi automatique de l’intervenant dans la preview | `4311c70`, `frontend/src/utils/multicamMontage.ts` | Associer caméras et micros, puis montrer le suivi de la conversation. Bien nommer la preview. |
| Export des angles et micros sur des pistes séparées et coupées ensemble | `bdac471`, `backend-rust/autotrim-api/tests/stacked_export.rs` | L’angle principal est actif, les autres disponibles. Ne pas promettre que les changements de plan automatiques de la preview sont exportés. |
| Reprises/répétitions via LLM | `bb4d89a`, `8e06842`, chaînes expérimentales de l’app | Fonction cachée et expérimentale : ne pas la promouvoir comme fonctionnalité standard v2. |
| Licence demandée à l’export, nettoyage gratuit | `frontend/src/components/ProcessingQueue.tsx`, contrôles `hasLicense` aux exports | Essai gratuit visible près des CTA ; limite de l’export expliquée dans la FAQ. |
| Installation, progression, refonte UI et nouvel export média | Historique des commits de septembre | Soutiennent la facilité d’usage, sans ajouter des sections sur la plomberie interne. |

Les garanties d’import dans chaque logiciel, la couverture linguistique exacte des hésitations et les performances comparatives n’ont pas été revalidées dans cette passe. Les chiffres de la session réelle et les témoignages déjà autorisés sont conservés. Les vidéos existantes n’ont pas été rerendues.

## Changements de la home

1. Retirer le bloc « Ce que les autres ne font pas », ses trois cartes, son lien licences et sa navigation.
2. Mettre le gain de temps dans le titre de la section silences ; restaurer le traitement de tous les fichiers en parallèle dans son texte.
3. Décrire les hésitations comme une amélioration concrète du résultat.
4. Montrer la timeline unique et le contrôle sur les coupes avant les cas multicam plus avancés.
5. Remplacer la pseudo-citation du menu d’export par une explication de la récupération d’une respiration.
6. Répartir l’explication multicam sous les trois démonstrations correspondantes. Préciser la différence preview/export.
7. Relier le local à l’absence d’upload et aux vrais projets du visiteur.
8. Rendre l’essai gratuit visible dans le héros et conclure par une invitation à essayer ses propres rushes.

Ordre : Hero → Silences → Hésitations → Timeline → Preview → Multicam → Local → Témoignages → FAQ → Essai.

FR et EN mis à jour. ES et ZH conservent le fallback anglais de la nouvelle landing. Le héros visuel validé, les capsules, les pages tarifs/download/compare et les autorisations des témoignages sont préservés. Les événements CTA et sections existants sont conservés ; l’événement de la section retirée disparaît avec elle.

## Précision de Benjamin : matching au-delà du son

Ne pas réduire le matching à une corrélation audio. AutoTrim retrouve aussi les fichiers qui appartiennent à une même prise à partir de leurs durées, heures d’enregistrement et métadonnées. Le cas Riverside, avec une piste isolée par intervenant sans voix commune, illustre cette capacité dans le texte principal. Le son commun est une voie de synchronisation précise parmi les mécanismes du système. Dans le code examiné, les pistes isolées dont début et durée concordent sont regroupées avec une indication de vérification. La FAQ garde cette distinction sans transformer le discours principal en liste de réserves.
