# 🏥 MedCabin - Landing Page

Plateforme de gestion de cabinet médical moderne.

## 📁 Structure du projet

```
medcabin-app/
├── index.html      # Page d'accueil
├── styles.css      # Styles CSS
├── script.js       # JavaScript interactif
├── config.js       # Configuration centralisée
└── README.md       # Ce fichier
```

## 🚀 Déploiement sur GitHub

### 1. Télécharger les fichiers

Téléchargez ces 4 fichiers depuis Claude :
- `index.html`
- `styles.css`
- `script.js`
- `config.js`

### 2. Uploader sur GitHub

1. Allez sur votre repository : `https://github.com/v8phwthwc4-dot/medcabin-app`
2. Cliquez sur "Add file" → "Upload files"
3. Glissez-déposez les 4 fichiers
4. Ajoutez un message : "Ajout de la landing page"
5. Cliquez sur "Commit changes"

## 🌐 Déployer sur Vercel

### Méthode automatique (recommandée)

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repo GitHub `medcabin-app`
4. Configuration :
   - **Framework Preset** : Other
   - **Root Directory** : ./
   - **Build Command** : (laissez vide)
   - **Output Directory** : ./
5. Cliquez sur "Deploy"
6. Attendez 2-3 minutes ⏱️
7. Votre site est en ligne ! 🎉

### Connecter votre domaine

Une fois déployé :
1. Dans Vercel, allez dans "Settings" → "Domains"
2. Ajoutez `medcabingest.com`
3. Suivez les instructions DNS fournies
4. Configurez chez votre registrar (où vous avez acheté le domaine)
5. Attendez 10-60 minutes pour la propagation

## ✏️ Personnalisation

### Changer le nom de marque

Éditez `config.js` :
```javascript
branding: {
    name: "NouveauNom",  // ← Changez ici
    tagline: "Votre nouveau slogan"
}
```

### Changer les coordonnées

Éditez `config.js` :
```javascript
contact: {
    email: "nouveau@email.com",
    phone: "0612345678",
    city: "Votre ville"
}
```

### Changer les couleurs

Éditez `styles.css` :
```css
:root {
    --primary: #667eea;  /* ← Changez les couleurs ici */
}
```

## 📱 Test local

Pour tester en local avant déploiement :

1. Ouvrez simplement `index.html` dans votre navigateur
2. OU utilisez un serveur local :
   ```bash
   # Si vous avez Python installé
   python -m http.server 8000
   # Puis ouvrez http://localhost:8000
   ```

## 🔄 Mises à jour

Pour modifier le site après déploiement :

1. Modifiez les fichiers en local
2. Uploadez-les sur GitHub (même méthode qu'au début)
3. Vercel redéploie automatiquement en 30 secondes !

## 📊 Prochaines étapes

Une fois la landing page en ligne :

1. ✅ Tester sur mobile et desktop
2. ✅ Partager le lien à des médecins pour feedback
3. ✅ Configurer Google Analytics (optionnel)
4. 🚀 Commencer le développement de l'application complète

## 🆘 Besoin d'aide ?

Si vous rencontrez un problème :
- Vérifiez que tous les fichiers sont bien uploadés
- Videz le cache de votre navigateur (Ctrl+Shift+R)
- Contactez-moi via Claude !

## 📄 Licence

© 2026 MedCabin. Tous droits réservés.
