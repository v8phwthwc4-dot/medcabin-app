# 🚀 INSTRUCTIONS DE DÉPLOIEMENT - MedCabin v2.0
## Spécialités médicales adaptatives

---

## 📦 Fichiers livrés

1. **`1-user-profile.sql`** → Script SQL à exécuter dans Supabase
2. **`specialties-config.js`** → Configuration des 17 spécialités
3. **`profile-api.js`** → API gestion profil médecin
4. **`onboarding.html`** → Page d'onboarding (3 étapes)
5. **`dashboard.html`** → Dashboard adaptatif (remplace l'existant)

---

## 🔧 Étapes de déploiement

### ÉTAPE 1 : Base de données (2 min)

1. Va sur https://supabase.com/dashboard
2. Ouvre ton projet MedCabin
3. Menu **SQL Editor** → **New query**
4. Copie-colle le contenu de **`1-user-profile.sql`**
5. Clique **Run** ✅

### ÉTAPE 2 : Uploader les fichiers sur GitHub (3 min)

Ajouter / remplacer dans le repo `medcabin-app` :

| Fichier | Action |
|---------|--------|
| `specialties-config.js` | ➕ AJOUTER (nouveau) |
| `profile-api.js` | ➕ AJOUTER (nouveau) |
| `onboarding.html` | ➕ AJOUTER (nouveau) |
| `dashboard.html` | 🔄 REMPLACER (existant) |

### ÉTAPE 3 : Modifier `signup.html` (1 min)

**Trouver la ligne qui redirige après inscription** (généralement vers `dashboard.html`) et **remplacer par** :

```javascript
window.location.href = 'onboarding.html'
```

> ℹ️ Si tu veux que je modifie aussi signup.html, envoie-le moi.

### ÉTAPE 4 : Tester (2 min)

1. Push sur GitHub → Vercel déploie automatiquement
2. Va sur https://medcabin-app.vercel.app
3. **Pour ton compte existant** : Va manuellement sur `/onboarding.html` pour configurer ta spécialité
4. **Pour un nouveau compte** : L'onboarding se lance automatiquement

---

## 🎯 Ce qui change pour le médecin

### Au moment de l'inscription
- **3 questions** : Spécialité + Type de pratique + Validation
- 17 spécialités au choix : Généraliste, Pédiatre, Gynécologue, Dentiste, Cardiologue, Dermato, Ophtalmo, ORL, Psychiatre, Kiné, Neurologue, Rhumato, Gastro, Urologue, Endocrino, Pneumologue, Autre

### Sur le dashboard
- **Icône et couleur** adaptés à la spécialité
- **Titre personnalisé** : "Dr. [Nom] • [Spécialité]"
- **Sidebar dynamique** : seulement les modules pertinents
- **Actions rapides** filtrées
- **Couleur des graphiques** adaptée

### Champs patients (à venir)
Chaque spécialité a ses champs spécifiques pré-configurés dans `specialties-config.js`.

Exemples :
- **Pédiatre** → poids/taille naissance, allaitement, allergies, vaccins
- **Cardiologue** → tension, fréquence cardiaque, cholestérol
- **Dentiste** → schéma dentaire, dernière visite, plan de traitement
- **Gynécologue** → DDR, gravidité, parité, contraception

---

## 📋 Prochaine étape (Phase 3 complète)

Pour finir l'adaptation aux spécialités, il faudra encore modifier :

1. **`patient-add.html`** → ajouter dynamiquement les champs custom selon la spécialité
2. **`patient-detail.html`** → afficher les sections spécifiques
3. **`appointment-add.html`** → utiliser les types de RDV et durées de la spécialité

Dis-moi quand tu veux qu'on attaque ces 3 fichiers.

---

## 🆘 En cas de problème

### "Redirection en boucle vers onboarding"
→ Vérifier que la table `user_profile` est bien créée dans Supabase.

### "Dashboard reste blanc"
→ Ouvrir F12 → Console et regarder les erreurs.
→ Vérifier que les 4 fichiers JS/HTML sont bien uploadés.

### "Mon ancien compte ne voit pas la nouvelle interface"
→ C'est normal, il n'a pas de profil. Va sur `/onboarding.html` pour configurer.

---

## 🎉 Résultat

✅ Onboarding en 3 étapes
✅ 17 spécialités configurées
✅ Dashboard 100% adaptatif (icône, couleur, menu, actions)
✅ Architecture modulaire (facile d'ajouter une spécialité)
✅ Compatible avec l'existant (généraliste = comportement actuel)
