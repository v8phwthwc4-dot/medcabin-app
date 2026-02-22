// ===== IMPORT CSV API =====
// Gestion de l'import de données CSV

import { supabase } from './supabase-client.js'
import { createPatient, validatePatientData } from './patients-api.js'
import { createAppointment } from './appointments-api.js'
import { createInvoice } from './invoices-api.js'

// ===== PARSER CSV =====
export function parseCSV(csvText) {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
        return { success: false, error: 'Fichier vide' }
    }
    
    const headers = lines[0].split(',').map(h => h.trim())
    const rows = []
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row = {}
        headers.forEach((header, index) => {
            row[header] = values[index] || null
        })
        rows.push(row)
    }
    
    return { success: true, headers, rows }
}

// ===== IMPORTER DES PATIENTS =====
export async function importPatients(rows) {
    const results = {
        success: 0,
        errors: 0,
        details: []
    }
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        
        try {
            // Préparer les données
            const patientData = {
                nom: row.nom,
                prenom: row.prenom,
                date_naissance: row.date_naissance,
                sexe: row.sexe,
                telephone: row.telephone,
                email: row.email || null,
                adresse: row.adresse || null,
                ville: row.ville || null,
                custom_fields: {}
            }
            
            // Valider
            const validation = validatePatientData(patientData)
            if (!validation.isValid) {
                results.errors++
                results.details.push({
                    row: i + 2,
                    status: 'error',
                    message: validation.errors.join(', ')
                })
                continue
            }
            
            // Créer
            const result = await createPatient(patientData)
            if (result.success) {
                results.success++
                results.details.push({
                    row: i + 2,
                    status: 'success',
                    message: `${patientData.prenom} ${patientData.nom} importé`
                })
            } else {
                results.errors++
                results.details.push({
                    row: i + 2,
                    status: 'error',
                    message: result.error
                })
            }
        } catch (error) {
            results.errors++
            results.details.push({
                row: i + 2,
                status: 'error',
                message: error.message
            })
        }
    }
    
    return results
}

// ===== IMPORTER DES RENDEZ-VOUS =====
export async function importAppointments(rows, patientsList) {
    const results = {
        success: 0,
        errors: 0,
        details: []
    }
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        
        try {
            // Trouver le patient par nom/prénom si fourni
            let patientId = row.patient_id
            
            if (!patientId && row.patient_nom && row.patient_prenom) {
                const patient = patientsList.find(p => 
                    p.nom.toLowerCase() === row.patient_nom.toLowerCase() &&
                    p.prenom.toLowerCase() === row.patient_prenom.toLowerCase()
                )
                if (patient) {
                    patientId = patient.id
                }
            }
            
            if (!patientId) {
                results.errors++
                results.details.push({
                    row: i + 2,
                    status: 'error',
                    message: 'Patient non trouvé'
                })
                continue
            }
            
            const appointmentData = {
                patient_id: patientId,
                date: row.date,
                heure_debut: row.heure_debut,
                heure_fin: row.heure_fin,
                type: row.type || 'consultation',
                statut: row.statut || 'confirme',
                motif: row.motif || null,
                notes: row.notes || null
            }
            
            const result = await createAppointment(appointmentData)
            if (result.success) {
                results.success++
                results.details.push({
                    row: i + 2,
                    status: 'success',
                    message: `RDV du ${row.date} importé`
                })
            } else {
                results.errors++
                results.details.push({
                    row: i + 2,
                    status: 'error',
                    message: result.error
                })
            }
        } catch (error) {
            results.errors++
            results.details.push({
                row: i + 2,
                status: 'error',
                message: error.message
            })
        }
    }
    
    return results
}

// ===== IMPORTER DES FACTURES =====
export async function importInvoices(rows, patientsList) {
    const results = {
        success: 0,
        errors: 0,
        details: []
    }
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        
        try {
            let patientId = row.patient_id
            
            if (!patientId && row.patient_nom && row.patient_prenom) {
                const patient = patientsList.find(p => 
                    p.nom.toLowerCase() === row.patient_nom.toLowerCase() &&
                    p.prenom.toLowerCase() === row.patient_prenom.toLowerCase()
                )
                if (patient) {
                    patientId = patient.id
                }
            }
            
            if (!patientId) {
                results.errors++
                results.details.push({
                    row: i + 2,
                    status: 'error',
                    message: 'Patient non trouvé'
                })
                continue
            }
            
            const invoiceData = {
                patient_id: patientId,
                date_facture: row.date_facture,
                montant: parseFloat(row.montant),
                statut: row.statut || 'en_attente',
                mode_paiement: row.mode_paiement || null,
                date_paiement: row.date_paiement || null,
                description: row.description || null,
                notes: row.notes || null
            }
            
            const result = await createInvoice(invoiceData)
            if (result.success) {
                results.success++
                results.details.push({
                    row: i + 2,
                    status: 'success',
                    message: `Facture de ${row.montant} DH importée`
                })
            } else {
                results.errors++
                results.details.push({
                    row: i + 2,
                    status: 'error',
                    message: result.error
                })
            }
        } catch (error) {
            results.errors++
            results.details.push({
                row: i + 2,
                status: 'error',
                message: error.message
            })
        }
    }
    
    return results
}

// ===== TÉLÉCHARGER UN TEMPLATE CSV =====
export function downloadTemplate(type) {
    let csv = ''
    
    switch (type) {
        case 'patients':
            csv = 'nom,prenom,date_naissance,sexe,telephone,email,adresse,ville\n'
            csv += 'Alami,Fatima,1985-03-15,F,0612345678,fatima@example.com,12 Rue Hassan II,Fès\n'
            break
        
        case 'appointments':
            csv = 'date,heure_debut,heure_fin,type,statut,motif,patient_nom,patient_prenom\n'
            csv += '2026-02-25,09:00:00,09:30:00,consultation,confirme,Consultation de routine,Alami,Fatima\n'
            break
        
        case 'invoices':
            csv = 'date_facture,montant,statut,mode_paiement,date_paiement,description,patient_nom,patient_prenom\n'
            csv += '2026-02-22,300.00,payee,especes,2026-02-22,Consultation générale,Alami,Fatima\n'
            break
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `template_${type}.csv`
    link.click()
}

console.log('✅ Import CSV API chargée')
