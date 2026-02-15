// ===== SUPABASE CLIENT CONFIGURATION =====
// Ce fichier gère la connexion à Supabase

// Import de la librairie Supabase depuis CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Configuration Supabase
// IMPORTANT: Ces valeurs doivent être remplacées par vos vraies clés
const SUPABASE_URL = 'https://lqnbmzphgsuhzoeorrfa.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_qpfAcb4cG8mux33JBaE66A_nexbHGJR' // À remplacer par votre vraie clé

// Créer le client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Fonction pour vérifier si l'utilisateur est connecté
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    } catch (error) {
        console.error('Erreur récupération utilisateur:', error.message)
        return null
    }
}

// Fonction pour se connecter
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return { success: true, user: data.user }
    } catch (error) {
        console.error('Erreur connexion:', error.message)
        return { success: false, error: error.message }
    }
}

// Fonction pour s'inscrire
export async function signUp(email, password, userData = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        })
        if (error) throw error
        return { success: true, user: data.user }
    } catch (error) {
        console.error('Erreur inscription:', error.message)
        return { success: false, error: error.message }
    }
}

// Fonction pour se déconnecter
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Erreur déconnexion:', error.message)
        return { success: false, error: error.message }
    }
}

// Fonction pour réinitialiser le mot de passe
export async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        })
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Erreur reset password:', error.message)
        return { success: false, error: error.message }
    }
}

// Écouter les changements d'état d'authentification
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session)
    })
}

console.log('✅ Supabase client initialisé')
