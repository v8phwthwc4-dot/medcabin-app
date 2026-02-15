# 🔐 CONFIGURATION SUPABASE - INSTRUCTIONS

## ⚠️ IMPORTANT : À faire AVANT de tester l'authentification

Vous devez configurer vos clés Supabase dans le fichier `supabase-client.js`.

---

## 📝 ÉTAPE PAR ÉTAPE

### **1. Ouvrir le fichier supabase-client.js**

Téléchargez le fichier `supabase-client.js` que je viens de créer.

### **2. Remplacer la clé ANON**

Trouvez cette ligne dans le fichier :

```javascript
const SUPABASE_ANON_KEY = 'VOTRE_ANON_KEY_ICI'
```

Et remplacez `'VOTRE_ANON_KEY_ICI'` par votre vraie clé **anon public key** que vous avez copiée depuis Supabase.

Exemple :
```javascript
const SUPABASE_ANON_KEY = 'sb_publishable_qpfAc44cG0mux33JBaE66A_naxbL...'
```

---

## ✅ VOS CLÉS SUPABASE

Voici vos informations (déjà pré-remplies dans le fichier) :

**Project URL :** ✅ Déjà configuré
```
https://lqnbmzphgsuhzoeorrfa.supabase.co
```

**Anon Key :** ❌ À CONFIGURER
```
Copiez la clé depuis Supabase → Settings → API → Publishable key
```

---

## 📂 RÉCAPITULATIF DES FICHIERS CRÉÉS

Je viens de créer **5 nouveaux fichiers** :

1. ✅ `supabase-client.js` - Client Supabase (CONFIGURE LA CLÉ ICI !)
2. ✅ `login.html` - Page de connexion
3. ✅ `signup.html` - Page d'inscription  
4. ✅ `dashboard-app.html` - Dashboard protégé (après connexion)
5. ✅ `SUPABASE-CONFIG.md` - Ce fichier d'instructions

---

## 🚀 PROCHAINES ÉTAPES

### **1. Télécharger tous les fichiers**

Téléchargez les 5 fichiers que je viens de créer.

### **2. Modifier supabase-client.js**

Ouvrez `supabase-client.js` dans un éditeur de texte (Bloc-notes, TextEdit, VS Code, etc.)

Remplacez `'VOTRE_ANON_KEY_ICI'` par votre vraie clé anon.

Sauvegardez le fichier.

### **3. Uploader sur GitHub**

Uploadez les 5 fichiers sur votre repository GitHub :
- Allez sur https://github.com/v8phwthwc4-dot/medcabin-app
- Add file → Upload files
- Glissez les 5 fichiers
- Commit message : "Ajout système d'authentification"
- Commit changes

### **4. Vercel redéploie automatiquement**

Dès que vous uploadez sur GitHub, Vercel détecte le changement et redéploie automatiquement en 30 secondes.

### **5. Tester**

Allez sur : `https://medcabin-app.vercel.app/signup.html`

Et créez votre premier compte ! 🎉

---

## ⚠️ RAPPEL IMPORTANT

**NE PARTAGEZ JAMAIS vos clés Supabase publiquement !**

La clé `anon public` est sécurisée pour être utilisée côté client (navigateur), mais gardez quand même le fichier `supabase-client.js` dans votre repository privé.

---

## 🆘 BESOIN D'AIDE ?

Si vous ne trouvez pas votre clé anon :
1. Allez sur https://supabase.com
2. Cliquez sur votre projet "Medicabin"
3. Settings → API
4. Copiez la clé "anon public"

---

**Bonne chance ! Vous allez avoir un système d'authentification complet très bientôt ! 🚀**
