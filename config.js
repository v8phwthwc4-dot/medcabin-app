// ===== CONFIGURATION MEDICABIN =====
// Ce fichier centralise toutes les informations modifiables
// Pour changer le branding, modifiez UNIQUEMENT ce fichier

const SITE_CONFIG = {
    // Informations de marque
    branding: {
        name: "MedCabin",
        fullName: "MedCabinGest",
        tagline: "Sauvez les gens, laissez-nous le reste",
        description: "Plateforme de gestion de cabinet médical"
    },
    
    // Domaine et URLs
    domain: {
        main: "medcabingest.com",
        www: "www.medcabingest.com",
        api: "api.medcabingest.com"
    },
    
    // Coordonnées de contact
    contact: {
        email: "abdellahdefaa23@gmail.com",
        phone: "0634602548",
        phoneFormatted: "06 34 60 25 48",
        city: "Fès",
        country: "Maroc",
        address: "Fès, Maroc"
    },
    
    // Réseaux sociaux (à remplir plus tard)
    social: {
        facebook: "",
        linkedin: "",
        twitter: "",
        instagram: ""
    },
    
    // Couleurs du thème
    colors: {
        primary: "#667eea",
        primaryDark: "#5568d3",
        secondary: "#764ba2",
        accent: "#10b981",
        dark: "#1e293b",
        gray: "#64748b",
        light: "#f8fafc",
        white: "#ffffff"
    },
    
    // Tarification
    pricing: {
        essentiel: {
            price: 600,
            currency: "DH",
            period: "mois",
            name: "Essentiel",
            description: "Pour les cabinets qui démarrent"
        },
        professionnel: {
            price: 1200,
            currency: "DH",
            period: "mois",
            name: "Professionnel",
            description: "Pour les cabinets établis"
        },
        cabinet: {
            price: 2000,
            currency: "DH",
            period: "mois",
            name: "Cabinet",
            description: "Pour les groupes médicaux"
        }
    },
    
    // Paramètres de l'essai gratuit
    trial: {
        duration: 30,
        requiresCreditCard: false
    },
    
    // Horaires d'ouverture
    businessHours: {
        weekdays: "Lun-Ven : 9h-18h",
        saturday: "Sam : 9h-13h",
        sunday: "Fermé"
    },
    
    // Paramètres techniques
    technical: {
        version: "1.0.0",
        environment: "production",
        apiVersion: "v1"
    }
};

// Fonction pour obtenir une config
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], SITE_CONFIG);
}

// Fonction pour mettre à jour une config (pour usage futur dans l'admin)
function updateConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], SITE_CONFIG);
    target[lastKey] = value;
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, getConfig, updateConfig };
}

// Log de la configuration au chargement (dev only)
console.log('🏥 MedCabin Configuration:', SITE_CONFIG);
