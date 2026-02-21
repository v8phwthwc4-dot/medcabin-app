// ===== PRESCRIPTIONS API =====
// Gestion complète des ordonnances

import { supabase } from './supabase-client.js'

// ===== FORMES DE MÉDICAMENTS =====
export const MEDICATION_FORMS = {
    COMPRIME: 'Comprimé',
    GELULE: 'Gélule',
    SIROP: 'Sirop',
    INJECTION: 'Injection',
    POMMADE: 'Pommade',
    CREME: 'Crème',
    GOUTTES: 'Gouttes',
    SPRAY: 'Spray',
    SUPPOSITOIRE: 'Suppositoire',
    PATCH: 'Patch'
}

// ===== RÉCUPÉRER TOUTES LES ORDONNANCES =====
export async function getAllPrescriptions() {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone),
                items:prescription_items(*)
            `)
            .order('date_prescription', { ascending: false })
        
        if (error) throw error
        return { success: true, prescriptions: data }
    } catch (error) {
        console.error('Erreur récupération ordonnances:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER UNE ORDONNANCE PAR ID =====
export async function getPrescriptionById(prescriptionId) {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone, date_naissance, sexe, adresse, ville),
                appointment:appointments(date, heure_debut, motif),
                items:prescription_items(*)
            `)
            .eq('id', prescriptionId)
            .single()
        
        if (error) throw error
        
        // Trier les items par ordre
        if (data.items) {
            data.items.sort((a, b) => a.ordre - b.ordre)
        }
        
        return { success: true, prescription: data }
    } catch (error) {
        console.error('Erreur récupération ordonnance:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER LES ORDONNANCES D'UN PATIENT =====
export async function getPatientPrescriptions(patientId) {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
                *,
                items:prescription_items(*)
            `)
            .eq('patient_id', patientId)
            .order('date_prescription', { ascending: false })
        
        if (error) throw error
        return { success: true, prescriptions: data }
    } catch (error) {
        console.error('Erreur récupération ordonnances patient:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== CRÉER UNE ORDONNANCE =====
export async function createPrescription(prescriptionData, items) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        // Créer l'ordonnance
        const { data: prescription, error: prescriptionError } = await supabase
            .from('prescriptions')
            .insert([{
                ...prescriptionData,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single()
        
        if (prescriptionError) throw prescriptionError
        
        // Créer les lignes de médicaments
        if (items && items.length > 0) {
            const itemsToInsert = items.map((item, index) => ({
                prescription_id: prescription.id,
                ...item,
                ordre: index
            }))
            
            const { error: itemsError } = await supabase
                .from('prescription_items')
                .insert(itemsToInsert)
            
            if (itemsError) throw itemsError
        }
        
        return { success: true, prescription }
    } catch (error) {
        console.error('Erreur création ordonnance:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== METTRE À JOUR UNE ORDONNANCE =====
export async function updatePrescription(prescriptionId, prescriptionData, items) {
    try {
        // Mettre à jour l'ordonnance
        const { data: prescription, error: prescriptionError } = await supabase
            .from('prescriptions')
            .update({
                ...prescriptionData,
                updated_at: new Date().toISOString()
            })
            .eq('id', prescriptionId)
            .select()
            .single()
        
        if (prescriptionError) throw prescriptionError
        
        // Si des items sont fournis, supprimer les anciens et créer les nouveaux
        if (items) {
            // Supprimer les anciens items
            const { error: deleteError } = await supabase
                .from('prescription_items')
                .delete()
                .eq('prescription_id', prescriptionId)
            
            if (deleteError) throw deleteError
            
            // Créer les nouveaux items
            if (items.length > 0) {
                const itemsToInsert = items.map((item, index) => ({
                    prescription_id: prescriptionId,
                    ...item,
                    ordre: index
                }))
                
                const { error: itemsError } = await supabase
                    .from('prescription_items')
                    .insert(itemsToInsert)
                
                if (itemsError) throw itemsError
            }
        }
        
        return { success: true, prescription }
    } catch (error) {
        console.error('Erreur mise à jour ordonnance:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== SUPPRIMER UNE ORDONNANCE =====
export async function deletePrescription(prescriptionId) {
    try {
        const { error } = await supabase
            .from('prescriptions')
            .delete()
            .eq('id', prescriptionId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Erreur suppression ordonnance:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== VALIDER LES DONNÉES =====
export function validatePrescriptionData(prescriptionData, items) {
    const errors = []
    
    if (!prescriptionData.patient_id) {
        errors.push('Le patient est obligatoire')
    }
    
    if (!prescriptionData.date_prescription) {
        errors.push('La date est obligatoire')
    }
    
    if (!items || items.length === 0) {
        errors.push('Ajoutez au moins un médicament')
    }
    
    // Valider chaque item
    if (items) {
        items.forEach((item, index) => {
            if (!item.medicament_nom || item.medicament_nom.trim() === '') {
                errors.push(`Médicament ${index + 1}: Le nom est obligatoire`)
            }
            if (!item.dosage || item.dosage.trim() === '') {
                errors.push(`Médicament ${index + 1}: Le dosage est obligatoire`)
            }
            if (!item.forme) {
                errors.push(`Médicament ${index + 1}: La forme est obligatoire`)
            }
            if (!item.posologie || item.posologie.trim() === '') {
                errors.push(`Médicament ${index + 1}: La posologie est obligatoire`)
            }
        })
    }
    
    return {
        isValid: errors.length === 0,
        errors
    }
}

// ===== FORMATER LA DATE =====
export function formatPrescriptionDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

console.log('✅ Prescriptions API chargée')
