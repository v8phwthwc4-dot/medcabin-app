// ===== CONFIGURATION =====
const CONFIG = {
    siteName: "MedCabin",
    domain: "medcabingest.com",
    email: "abdellahdefaa23@gmail.com",
    phone: "0634602548",
    city: "Fès"
};

// ===== SMOOTH SCROLL =====
function scrollToForm() {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
        signupSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// ===== DEMO VIDEO =====
function showDemo() {
    alert("🎥 La vidéo de démonstration sera bientôt disponible !\n\nEn attendant, essayez notre version d'essai gratuite pendant 30 jours.");
}

// ===== FORM HANDLERS =====
function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Récupérer les données du formulaire
    const data = {
        nom: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        telephone: form.querySelector('input[type="tel"]').value,
        ville: form.querySelector('select').value,
        timestamp: new Date().toISOString()
    };
    
    console.log('Inscription:', data);
    
    // Simulation d'envoi (à remplacer par vraie API plus tard)
    showSuccessMessage('✅ Merci pour votre inscription !\n\nNous vous contactons sous 24h pour configurer votre compte.\n\nVérifiez vos emails (y compris spam).');
    
    // Réinitialiser le formulaire
    form.reset();
    
    // TODO: Envoyer à l'API/Supabase
    // saveToSupabase(data);
}

function handleContact(event) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        nom: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        telephone: form.querySelector('input[type="tel"]').value,
        message: form.querySelector('textarea').value,
        timestamp: new Date().toISOString()
    };
    
    console.log('Contact:', data);
    
    showSuccessMessage('✅ Message envoyé !\n\nNous vous répondrons dans les 24 heures.\n\nMerci pour votre message.');
    
    form.reset();
    
    // TODO: Envoyer à l'API/Supabase
    // saveContactToSupabase(data);
}

// ===== NOTIFICATIONS =====
function showSuccessMessage(message) {
    alert(message);
    
    // Alternative plus moderne (peut être ajoutée plus tard) :
    // const notification = document.createElement('div');
    // notification.className = 'notification success';
    // notification.textContent = message;
    // document.body.appendChild(notification);
    // setTimeout(() => notification.remove(), 5000);
}

// ===== ANIMATIONS AU SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    document.querySelectorAll('.problem-card, .solution-card, .feature-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== TRACKING ANALYTICS (placeholder) =====
function trackEvent(eventName, eventData) {
    console.log('Event:', eventName, eventData);
    
    // TODO: Intégrer Google Analytics ou autre
    // gtag('event', eventName, eventData);
}

// ===== VALIDATION EMAIL =====
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== VALIDATION TÉLÉPHONE MAROC =====
function isValidMoroccanPhone(phone) {
    // Format: 0612345678 ou +212612345678
    const regex = /^(\+212|0)[5-7][0-9]{8}$/;
    return regex.test(phone.replace(/\s/g, ''));
}

// ===== INITIALISATION AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏥 MedCabin loaded successfully!');
    
    // Initialiser les animations
    initScrollAnimations();
    
    // Tracker la visite de page
    trackEvent('page_view', {
        page: window.location.pathname
    });
    
    // Smooth scroll pour tous les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Ajouter classe "scrolled" au navbar au scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
});

// ===== GESTION ERREURS =====
window.addEventListener('error', (event) => {
    console.error('Erreur détectée:', event.error);
    // TODO: Envoyer les erreurs à un service de monitoring
});

// ===== UTILS =====
const utils = {
    // Formater un numéro de téléphone
    formatPhone: (phone) => {
        return phone.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    },
    
    // Formater une date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Débounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Exporter pour utilisation externe si besoin
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, utils };
}
