// ===== CUSTOM FIELDS API =====
// Gestion des champs personnalisés configurables par le médecin

import { supabase } from './supabase-client.js'

// ===== RÉCUPÉRER TOUS LES CHAMPS PERSONNALISÉS DU MÉDECIN =====
export async function getCustomFields() {
    try {
        const { data, error } = await supabase
            .from('custom_field_templates')
            .select('*')
            .order('display_order', { ascending: true })
        
        if (error) throw error
        return { success: true, fields: data || [] }
    } catch (error) {
        console.error('Erreur récupération champs personnalisés:', error.message)
        return { success: false, error: error.message, fields: [] }
    }
}

// ===== CRÉER UN NOUVEAU CHAMP PERSONNALISÉ =====
export async function createCustomField(fieldData) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        const { data, error} = await supabase
            .from('custom_field_templates')
            .insert([{
                ...fieldData,
                user_id: user.id,
                created_at: new Date().toISOString()
            }])
            .select()
            .single()
        
        if (error) throw error
        return { success: true, field: data }
    } catch (error) {
        console.error('Erreur création champ personnalisé:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== METTRE À JOUR UN CHAMP PERSONNALISÉ =====
export async function updateCustomField(fieldId, fieldData) {
    try {
        const { data, error } = await supabase
            .from('custom_field_templates')
            .update(fieldData)
            .eq('id', fieldId)
            .select()
            .single()
        
        if (error) throw error
        return { success: true, field: data }
    } catch (error) {
        console.error('Erreur mise à jour champ personnalisé:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== SUPPRIMER UN CHAMP PERSONNALISÉ =====
export async function deleteCustomField(fieldId) {
    try {
        const { error } = await supabase
            .from('custom_field_templates')
            .delete()
            .eq('id', fieldId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Erreur suppression champ personnalisé:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉORGANISER L'ORDRE DES CHAMPS =====
export async function reorderCustomFields(fieldsWithNewOrder) {
    try {
        const updates = fieldsWithNewOrder.map((field, index) => ({
            id: field.id,
            display_order: index
        }))
        
        for (const update of updates) {
            const { error } = await supabase
                .from('custom_field_templates')
                .update({ display_order: update.display_order })
                .eq('id', update.id)
            
            if (error) throw error
        }
        
        return { success: true }
    } catch (error) {
        console.error('Erreur réorganisation champs:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== TYPES DE CHAMPS DISPONIBLES =====
export const FIELD_TYPES = {
    TEXT: 'text',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    SELECT: 'select',
    TEXTAREA: 'textarea',
    DATE: 'date'
}

// ===== LABELS POUR L'INTERFACE =====
export const FIELD_TYPE_LABELS = {
    [FIELD_TYPES.TEXT]: 'Texte court',
    [FIELD_TYPES.NUMBER]: 'Nombre',
    [FIELD_TYPES.BOOLEAN]: 'Oui/Non',
    [FIELD_TYPES.SELECT]: 'Liste déroulante',
    [FIELD_TYPES.TEXTAREA]: 'Texte long',
    [FIELD_TYPES.DATE]: 'Date'
}

// ===== VALIDATION DES DONNÉES DE CHAMP =====
export function validateFieldData(data) {
    const errors = []
    
    if (!data.field_name || data.field_name.trim() === '') {
        errors.push('Le nom du champ est obligatoire')
    }
    
    if (!data.field_label || data.field_label.trim() === '') {
        errors.push('Le libellé est obligatoire')
    }
    
    if (!data.field_type) {
        errors.push('Le type de champ est obligatoire')
    }
    
    if (data.field_type === FIELD_TYPES.SELECT) {
        if (!data.options || data.options.length === 0) {
            errors.push('Les options sont obligatoires pour une liste déroulante')
        }
    }
    
    // Validation du nom du champ (slug)
    if (data.field_name && !/^[a-z_][a-z0-9_]*$/.test(data.field_name)) {
        errors.push('Le nom du champ doit être en minuscules et sans espaces (ex: groupe_sanguin)')
    }
    
    return {
        isValid: errors.length === 0,
        errors
    }
}

// ===== GÉNÉRER UN SLUG À PARTIR DU LIBELLÉ =====
export function generateFieldName(label) {
    return label
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
        .replace(/[^a-z0-9]+/g, '_')      // Remplacer les caractères spéciaux par _
        .replace(/^_+|_+$/g, '')          // Enlever les _ au début et fin
}

console.log('✅ Custom Fields API chargée')
