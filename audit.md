# Audit de Sécurité - AutoTrimLanding

**Date**: 27 janvier 2026
**Scope**: Landing page Next.js (site marketing statique)
**Statut**: Amélioré

---

## Résumé

| Sévérité | Problèmes | Statut |
|----------|-----------|--------|
| 🟠 Haute | 0 | - |
| 🟡 Moyenne | 1 | ✅ Corrigé |
| 🟢 Faible / Bonnes pratiques | 5 | ✅ Corrigés |

**Contexte important** : Ce projet est une **landing page marketing statique**. Il n'y a pas de formulaires, pas d'authentification, pas de base de données, pas de données utilisateur affichées. Les risques de sécurité réels sont donc **très limités**.

---

## 🟡 Problème de Sévérité Moyenne

### 1. Headers de Sécurité Manquants

**Fichier**: `next.config.ts`

**Problème**: Aucun header HTTP de sécurité n'était configuré.

**Risque réel** : Faible à modéré
- **Clickjacking** : Quelqu'un pourrait intégrer la page dans une iframe. Mais les seules actions possibles sont des clics vers GitHub (téléchargement) ou LemonSqueezy (achat avec paiement sécurisé). Impact réel = minimal.
- **HSTS** : Vercel force déjà HTTPS, mais le header renforce cette protection.

**Pourquoi "Moyenne" et pas "Haute"** : Sur une landing page sans formulaires ni données sensibles, le clickjacking n'a pas d'impact critique. C'est de la défense en profondeur.

**Correction appliquée** :
```typescript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Content-Security-Policy', value: "..." }
    ]
  }];
}
```

**Note** : Le header `X-XSS-Protection` a été ajouté mais est **deprecated** (ignoré par Chrome depuis 2019). Il peut être retiré.

---

## 🟢 Bonnes Pratiques (Pas de vrais risques)

### 2. IDs de Tracking Hardcodés

**Fichiers**: `app/PostHogProvider.tsx`, `app/layout.tsx`

**Ce n'est PAS un risque de sécurité** :
- Ces IDs sont **par nature publics** (visibles dans le bundle JS)
- PostHog et Facebook ont des filtres anti-fraude
- Polluer les analytics d'un tiers n'a aucun intérêt pour un attaquant

**Pourquoi on a corrigé** : Gestion multi-environnement (dev/staging/prod) et historique Git propre.

---

### 3. Paramètres UTM Non Validés

**Fichier**: `hooks/useAttribution.ts`

**Ce n'est PAS un vrai risque** :
- Les UTM sont stockés en localStorage puis passés via `url.searchParams.set()` qui **encode automatiquement** les caractères spéciaux
- Ils ne sont **jamais rendus dans le DOM** via `dangerouslySetInnerHTML`
- Attaque XSS possible = aucune

**Pourquoi on a corrigé** : Bonne pratique défensive, données plus propres.

---

### 4. Cookies PostHog

**Fichier**: `app/PostHogProvider.tsx`

**Ce n'est PAS un vrai risque** :
- PostHog utilise déjà `SameSite=Lax` par défaut
- Un cookie de tracking n'a pas de valeur pour une attaque CSRF

**Pourquoi on a corrigé** : Ajout de `secure_cookie: true` par précaution, mais probablement redondant.

---

### 5. Referrer Complet en localStorage

**Fichier**: `hooks/useAttribution.ts`

**Risque** : Vie privée, pas sécurité
- L'URL complète du referrer pouvait contenir des paramètres sensibles
- Maintenant on stocke uniquement le hostname

**Pourquoi on a corrigé** : Minimisation des données collectées (RGPD friendly).

---

### 6. Iframe Vimeo sans Sandbox

**Fichier**: `components/VideoDemo.jsx`

**Ce n'est PAS un vrai risque** :
- Vimeo est un service de confiance
- L'ajout de `sandbox` peut **casser le player** (fullscreen, autoplay)

**Verdict** : Non corrigé car over-engineering. Laisser tel quel.

---

## Ce qui n'existe PAS sur ce projet

| Risque | Présent ? | Raison |
|--------|-----------|--------|
| XSS stocké | ❌ Non | Pas de données utilisateur affichées |
| CSRF | ❌ Non | Pas de formulaires |
| SQL Injection | ❌ Non | Pas de base de données |
| Auth bypass | ❌ Non | Pas d'authentification |
| Session hijacking | ❌ Non | Pas de sessions |

---

## Fichiers Modifiés

| Fichier | Modifications |
|---------|---------------|
| `next.config.ts` | Headers de sécurité |
| `app/PostHogProvider.tsx` | Migration env var + secure_cookie |
| `app/layout.tsx` | Migration Meta Pixel et GTM vers env vars |
| `hooks/useAttribution.ts` | Validation UTM + referrer hostname only |
| `.env.example` | Template des variables |

---

## Actions Requises

1. **Créer `.env.local`** :
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_META_PIXEL_ID=2240864149721547
   NEXT_PUBLIC_GTM_ID=GTM-MTPT8QGT
   ```

2. **Configurer les variables sur Vercel** (ou ton hébergeur)

3. **Optionnel** : Retirer `X-XSS-Protection` du CSP (header deprecated)

---

## Conclusion

**Ce projet était déjà relativement sécurisé.** Les modifications apportées sont des **bonnes pratiques** (défense en profondeur, code propre, gestion des environnements) mais ne corrigent pas de failles critiques exploitables.

Pour une landing page statique sans formulaires ni données utilisateur, les vrais risques de sécurité sont quasi inexistants.
