// ===== INVOICES API =====
// Gestion complète des factures

import { supabase } from './supabase-client.js'

// ===== STATUTS DE FACTURE =====
export const INVOICE_STATUS = {
    EN_ATTENTE: 'en_attente',
    PAYEE: 'payee',
    IMPAYEE: 'impayee'
}

export const INVOICE_STATUS_LABELS = {
    [INVOICE_STATUS.EN_ATTENTE]: 'En attente',
    [INVOICE_STATUS.PAYEE]: 'Payée',
    [INVOICE_STATUS.IMPAYEE]: 'Impayée'
}

export const INVOICE_STATUS_COLORS = {
    [INVOICE_STATUS.EN_ATTENTE]: '#f59e0b',
    [INVOICE_STATUS.PAYEE]: '#10b981',
    [INVOICE_STATUS.IMPAYEE]: '#ef4444'
}

// ===== MODES DE PAIEMENT =====
export const PAYMENT_METHODS = {
    ESPECES: 'especes',
    CARTE: 'carte',
    CHEQUE: 'cheque',
    VIREMENT: 'virement'
}

export const PAYMENT_METHOD_LABELS = {
    [PAYMENT_METHODS.ESPECES]: 'Espèces',
    [PAYMENT_METHODS.CARTE]: 'Carte bancaire',
    [PAYMENT_METHODS.CHEQUE]: 'Chèque',
    [PAYMENT_METHODS.VIREMENT]: 'Virement'
}

// ===== RÉCUPÉRER TOUTES LES FACTURES =====
export async function getAllInvoices() {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone)
            `)
            .order('date_facture', { ascending: false })
        
        if (error) throw error
        return { success: true, invoices: data }
    } catch (error) {
        console.error('Erreur récupération factures:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER UNE FACTURE PAR ID =====
export async function getInvoiceById(invoiceId) {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone, date_naissance, sexe, adresse, ville)
            `)
            .eq('id', invoiceId)
            .single()
        
        if (error) throw error
        return { success: true, invoice: data }
    } catch (error) {
        console.error('Erreur récupération facture:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER LES FACTURES D'UN PATIENT =====
export async function getPatientInvoices(patientId) {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('patient_id', patientId)
            .order('date_facture', { ascending: false })
        
        if (error) throw error
        return { success: true, invoices: data }
    } catch (error) {
        console.error('Erreur récupération factures patient:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== GÉNÉRER UN NUMÉRO DE FACTURE =====
export async function generateInvoiceNumber() {
    try {
        const { data, error } = await supabase.rpc('generate_invoice_number')
        
        if (error) throw error
        return { success: true, numero: data }
    } catch (error) {
        console.error('Erreur génération numéro:', error.message)
        // Fallback : générer localement
        const year = new Date().getFullYear()
        const random = Math.floor(Math.random() * 9999) + 1
        return { success: true, numero: `${year}-${String(random).padStart(4, '0')}` }
    }
}

// ===== CRÉER UNE FACTURE =====
export async function createInvoice(invoiceData) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        // Générer le numéro de facture si non fourni
        let numeroFacture = invoiceData.numero_facture
        if (!numeroFacture) {
            const result = await generateInvoiceNumber()
            numeroFacture = result.numero
        }
        
        const { data, error } = await supabase
            .from('invoices')
            .insert([{
                ...invoiceData,
                numero_facture: numeroFacture,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone)
            `)
            .single()
        
        if (error) throw error
        return { success: true, invoice: data }
    } catch (error) {
        console.error('Erreur création facture:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== METTRE À JOUR UNE FACTURE =====
export async function updateInvoice(invoiceId, invoiceData) {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .update({
                ...invoiceData,
                updated_at: new Date().toISOString()
            })
            .eq('id', invoiceId)
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone)
            `)
            .single()
        
        if (error) throw error
        return { success: true, invoice: data }
    } catch (error) {
        console.error('Erreur mise à jour facture:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== MARQUER COMME PAYÉE =====
export async function markAsPaid(invoiceId, paymentData) {
    return updateInvoice(invoiceId, {
        statut: INVOICE_STATUS.PAYEE,
        mode_paiement: paymentData.mode_paiement,
        date_paiement: paymentData.date_paiement || new Date().toISOString().split('T')[0]
    })
}

// ===== SUPPRIMER UNE FACTURE =====
export async function deleteInvoice(invoiceId) {
    try {
        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', invoiceId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Erreur suppression facture:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== STATISTIQUES =====
export async function getInvoiceStats() {
    try {
        const result = await getAllInvoices()
        
        if (!result.success) return result
        
        const invoices = result.invoices
        
        const stats = {
            total: invoices.length,
            total_montant: invoices.reduce((sum, inv) => sum + parseFloat(inv.montant || 0), 0),
            payees: invoices.filter(inv => inv.statut === INVOICE_STATUS.PAYEE).length,
            montant_paye: invoices
                .filter(inv => inv.statut === INVOICE_STATUS.PAYEE)
                .reduce((sum, inv) => sum + parseFloat(inv.montant || 0), 0),
            en_attente: invoices.filter(inv => inv.statut === INVOICE_STATUS.EN_ATTENTE).length,
            montant_en_attente: invoices
                .filter(inv => inv.statut === INVOICE_STATUS.EN_ATTENTE)
                .reduce((sum, inv) => sum + parseFloat(inv.montant || 0), 0),
            impayees: invoices.filter(inv => inv.statut === INVOICE_STATUS.IMPAYEE).length,
            montant_impaye: invoices
                .filter(inv => inv.statut === INVOICE_STATUS.IMPAYEE)
                .reduce((sum, inv) => sum + parseFloat(inv.montant || 0), 0)
        }
        
        return { success: true, stats }
    } catch (error) {
        console.error('Erreur stats factures:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== FORMATER LE MONTANT =====
export function formatAmount(amount) {
    if (!amount) return '0.00 DH'
    return parseFloat(amount).toFixed(2) + ' DH'
}

// ===== FORMATER LA DATE =====
export function formatInvoiceDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// ===== VALIDER LES DONNÉES =====
export function validateInvoiceData(data) {
    const errors = []
    
    if (!data.patient_id) {
        errors.push('Le patient est obligatoire')
    }
    
    if (!data.montant || parseFloat(data.montant) <= 0) {
        errors.push('Le montant doit être supérieur à 0')
    }
    
    if (!data.date_facture) {
        errors.push('La date de facture est obligatoire')
    }
    
    return {
        isValid: errors.length === 0,
        errors
    }
}

console.log('✅ Invoices API chargée')
