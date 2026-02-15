// ===== PATIENTS API =====
// Toutes les fonctions pour gérer les patients avec Supabase

import { supabase } from './supabase-client.js'

// ===== RÉCUPÉRER TOUS LES PATIENTS =====
export async function getAllPatients() {
    try {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return { success: true, patients: data }
    } catch (error) {
        console.error('Erreur récupération patients:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER UN PATIENT PAR ID =====
export async function getPatientById(patientId) {
    try {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientId)
            .single()
        
        if (error) throw error
        return { success: true, patient: data }
    } catch (error) {
        console.error('Erreur récupération patient:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== CRÉER UN NOUVEAU PATIENT =====
export async function createPatient(patientData) {
    try {
        // Récupérer l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        const { data, error } = await supabase
            .from('patients')
            .insert([{
                ...patientData,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single()
        
        if (error) throw error
        return { success: true, patient: data }
    } catch (error) {
        console.error('Erreur création patient:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== METTRE À JOUR UN PATIENT =====
export async function updatePatient(patientId, patientData) {
    try {
        const { data, error } = await supabase
            .from('patients')
            .update({
                ...patientData,
                updated_at: new Date().toISOString()
            })
            .eq('id', patientId)
            .select()
            .single()
        
        if (error) throw error
        return { success: true, patient: data }
    } catch (error) {
        console.error('Erreur mise à jour patient:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== SUPPRIMER UN PATIENT =====
export async function deletePatient(patientId) {
    try {
        const { error } = await supabase
            .from('patients')
            .delete()
            .eq('id', patientId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Erreur suppression patient:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RECHERCHER DES PATIENTS =====
export async function searchPatients(query) {
    try {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%,telephone.ilike.%${query}%`)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return { success: true, patients: data }
    } catch (error) {
        console.error('Erreur recherche patients:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== CALCULER L'ÂGE À PARTIR DE LA DATE DE NAISSANCE =====
export function calculateAge(dateNaissance) {
    if (!dateNaissance) return null
    
    const today = new Date()
    const birthDate = new Date(dateNaissance)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    
    return age
}

// ===== FORMATER LA DATE =====
export function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// ===== VALIDER LES DONNÉES DU PATIENT =====
export function validatePatientData(data) {
    const errors = []
    
    if (!data.nom || data.nom.trim() === '') {
        errors.push('Le nom est obligatoire')
    }
    
    if (!data.prenom || data.prenom.trim() === '') {
        errors.push('Le prénom est obligatoire')
    }
    
    if (!data.date_naissance) {
        errors.push('La date de naissance est obligatoire')
    }
    
    if (!data.sexe) {
        errors.push('Le sexe est obligatoire')
    }
    
    if (!data.telephone || data.telephone.trim() === '') {
        errors.push('Le téléphone est obligatoire')
    }
    
    // Validation du format téléphone marocain
    if (data.telephone && !/^(\+212|0)[5-7][0-9]{8}$/.test(data.telephone.replace(/\s/g, ''))) {
        errors.push('Le format du téléphone est invalide (ex: 0612345678)')
    }
    
    // Validation email si fourni
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Le format de l\'email est invalide')
    }
    
    return {
        isValid: errors.length === 0,
        errors
    }
}

console.log('✅ Patients API chargée')
