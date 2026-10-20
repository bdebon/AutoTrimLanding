# Règles pour Claude

## Lancer des commandes

Tu peux lancer ce dont tu as besoin dans le projet : `npm run dev`, `npm run build`, les tests,
des scripts.

**La seule règle : ne jamais doubler ce qui tourne déjà.** Benjamin a souvent son propre serveur
de dev ouvert sur le port 3000 (`curl -sI localhost:3000`) : s'il répond, utilise-le. Si tu en
démarres un, prends un autre port (`npm run dev -- --port 3100`) et arrête-le quand tu as fini.

Les tests tournent avec Node 24 (Node 20 ne lit pas le TypeScript) :
`~/.nvm/versions/node/v24.18.1/bin/node --test tests/*.test.mjs`.
