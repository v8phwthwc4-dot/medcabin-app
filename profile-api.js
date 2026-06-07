// ===== PROFILE API =====
// Gestion du profil médecin (spécialité, préférences)

import { supabase } from './supabase-client.js'
import { getSpecialty } from './specialties-config.js'

// ===== RÉCUPÉRER LE PROFIL =====
export async function getUserProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Non connecté')
        
        const { data, error } = await supabase
            .from('user_profile')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()
        
        if (error) throw error
        
        // Si pas de profil, retourner profil par défaut
        if (!data) {
            return { 
                success: true, 
                profile: null,
                needsOnboarding: true
            }
        }
        
        return { 
            success: true, 
            profile: data,
            needsOnboarding: !data.onboarding_completed
        }
    } catch (error) {
        console.error('Erreur récupération profil:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== CRÉER LE PROFIL (onboarding) =====
export async function createUserProfile(profileData) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Non connecté')
        
        const { data, error } = await supabase
            .from('user_profile')
            .upsert({
                user_id: user.id,
                full_name: profileData.full_name || user.email.split('@')[0],
                specialite: profileData.specialite || 'generaliste',
                practice_type: profileData.practice_type || 'solo',
                features: profileData.features || {},
                onboarding_completed: true,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()
        
        if (error) throw error
        return { success: true, profile: data }
    } catch (error) {
        console.error('Erreur création profil:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== METTRE À JOUR LE PROFIL =====
export async function updateUserProfile(updates) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Non connecté')
        
        const { data, error } = await supabase
            .from('user_profile')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select()
            .single()
        
        if (error) throw error
        return { success: true, profile: data }
    } catch (error) {
        console.error('Erreur mise à jour profil:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER LA SPÉCIALITÉ (cache simple) =====
let _cachedSpecialty = null

export async function getMySpecialty() {
    if (_cachedSpecialty) return _cachedSpecialty
    
    const result = await getUserProfile()
    if (result.success && result.profile) {
        _cachedSpecialty = getSpecialty(result.profile.specialite)
        _cachedSpecialty._key = result.profile.specialite
        return _cachedSpecialty
    }
    return getSpecialty('generaliste')
}

export function clearSpecialtyCache() {
    _cachedSpecialty = null
}

console.log('✅ Profile API chargée')
