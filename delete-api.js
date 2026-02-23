// ===== DELETE API =====
// Gestion de la suppression en masse des données

import { supabase } from './supabase-client.js'

// ===== SUPPRIMER DES PATIENTS SÉLECTIONNÉS =====
export async function deleteSelectedPatients(patientIds) {
    const results = { success: 0, errors: 0, details: [] }
    
    for (const id of patientIds) {
        try {
            const { error } = await supabase
                .from('patients')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            results.success++
        } catch (error) {
            results.errors++
            results.details.push({ id, error: error.message })
        }
    }
    
    return results
}

// ===== SUPPRIMER DES RDV SÉLECTIONNÉS =====
export async function deleteSelectedAppointments(appointmentIds) {
    const results = { success: 0, errors: 0, details: [] }
    
    for (const id of appointmentIds) {
        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            results.success++
        } catch (error) {
            results.errors++
            results.details.push({ id, error: error.message })
        }
    }
    
    return results
}

// ===== SUPPRIMER DES FACTURES SÉLECTIONNÉES =====
export async function deleteSelectedInvoices(invoiceIds) {
    const results = { success: 0, errors: 0, details: [] }
    
    for (const id of invoiceIds) {
        try {
            const { error } = await supabase
                .from('invoices')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            results.success++
        } catch (error) {
            results.errors++
            results.details.push({ id, error: error.message })
        }
    }
    
    return results
}

// ===== SUPPRIMER TOUTES LES DONNÉES =====
export async function deleteAllData() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Non connecté')
        
        // Supprimer dans l'ordre (à cause des foreign keys)
        
        // 1. Ordonnances (items puis prescriptions)
        const { data: prescriptions } = await supabase
            .from('prescriptions')
            .select('id')
        
        if (prescriptions) {
            for (const p of prescriptions) {
                await supabase
                    .from('prescription_items')
                    .delete()
                    .eq('prescription_id', p.id)
            }
        }
        
        await supabase.from('prescriptions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        
        // 2. Factures
        await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        
        // 3. Rendez-vous
        await supabase.from('appointments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        
        // 4. Patients
        await supabase.from('patients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        
        // 5. Custom fields
        await supabase.from('custom_field_templates').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        
        return { success: true }
    } catch (error) {
        console.error('Erreur suppression totale:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== COMPTER LES DONNÉES =====
export async function getDataCounts() {
    try {
        const [patients, appointments, invoices, prescriptions] = await Promise.all([
            supabase.from('patients').select('id', { count: 'exact', head: true }),
            supabase.from('appointments').select('id', { count: 'exact', head: true }),
            supabase.from('invoices').select('id', { count: 'exact', head: true }),
            supabase.from('prescriptions').select('id', { count: 'exact', head: true })
        ])
        
        return {
            success: true,
            counts: {
                patients: patients.count || 0,
                appointments: appointments.count || 0,
                invoices: invoices.count || 0,
                prescriptions: prescriptions.count || 0
            }
        }
    } catch (error) {
        console.error('Erreur comptage:', error.message)
        return { success: false, error: error.message }
    }
}

console.log('✅ Delete API chargée')
