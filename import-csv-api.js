// ===== IMPORT CSV API =====
// Gestion de l'import de données CSV

import { supabase } from './supabase-client.js'
import { createPatient, validatePatientData } from './patients-api.js'
import { createAppointment } from './appointments-api.js'
import { createInvoice } from './invoices-api.js'

// ===== PARSER CSV =====
export function parseCSV(csvText) {
    const lines = csvText.trim().split('\n').filter(line => line.trim())
    if (lines.length < 2) {
        return { success: false, error: 'Fichier vide' }
    }
    
    // Parser plus robuste qui gère les virgules dans les guillemets
    function parseLine(line) {
        const result = []
        let current = ''
        let inQuotes = false
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i]
            
            if (char === '"') {
                inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }
        result.push(current.trim())
        return result
    }
    
    const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, ''))
    const rows = []
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = parseLine(lines[i]).map(v => v.replace(/['"]/g, ''))
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
            // Mapping flexible des colonnes (accepte plusieurs variantes)
            const patientData = {
                nom: row.nom || row.name || row.lastname || null,
                prenom: row.prenom || row.firstname || row.prénom || null,
                date_naissance: row.date_naissance || row.date_de_naissance || row.birthdate || row.dob || null,
                sexe: row.sexe || row.gender || row.sex || null,
                telephone: row.telephone || row.phone || row.tel || row.téléphone || null,
                email: row.email || row.mail || null,
                adresse: row.adresse || row.address || null,
                ville: row.ville || row.city || null,
                custom_fields: {}
            }
            
            // Normaliser le sexe
            if (patientData.sexe) {
                const s = patientData.sexe.toUpperCase()
                if (s === 'H' || s === 'HOMME' || s === 'M' || s === 'MALE') {
                    patientData.sexe = 'M'
                } else if (s === 'F' || s === 'FEMME' || s === 'FEMALE') {
                    patientData.sexe = 'F'
                }
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
                    message: `${patientData.prenom} ${patientData.nom} importé(e)`
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
            // Trouver le patient de manière flexible
            let patientId = row.patient_id || row.patientid || row.id_patient
            
            if (!patientId) {
                // Essayer de trouver par nom/prénom
                const nom = row.patient_nom || row.patientnom || row.nom_patient || row.nom
                const prenom = row.patient_prenom || row.patientprenom || row.prenom_patient || row.prenom
                
                if (nom && prenom) {
                    const patient = patientsList.find(p => 
                        p.nom.toLowerCase() === nom.toLowerCase() &&
                        p.prenom.toLowerCase() === prenom.toLowerCase()
                    )
                    if (patient) {
                        patientId = patient.id
                    }
                }
            }
            
            if (!patientId) {
                results.errors++
                results.details.push({
                    row: i + 2,
                    status: 'error',
                    message: 'Patient non trouvé (indiquez patient_id ou patient_nom + patient_prenom)'
                })
                continue
            }
            
            const appointmentData = {
                patient_id: patientId,
                date: row.date || null,
                heure_debut: row.heure_debut || row.heure || row.time || '09:00:00',
                heure_fin: row.heure_fin || row.end_time || '09:30:00',
                type: row.type || 'consultation',
                statut: row.statut || row.status || 'confirme',
                motif: row.motif || row.reason || null,
                notes: row.notes || null
            }
            
            const result = await createAppointment(appointmentData)
            if (result.success) {
                results.success++
                results.details.push({
                    row: i + 2,
                    status: 'success',
                    message: `RDV du ${appointmentData.date} importé`
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
            let patientId = row.patient_id || row.patientid || row.id_patient
            
            if (!patientId) {
                const nom = row.patient_nom || row.patientnom || row.nom_patient || row.nom
                const prenom = row.patient_prenom || row.patientprenom || row.prenom_patient || row.prenom
                
                if (nom && prenom) {
                    const patient = patientsList.find(p => 
                        p.nom.toLowerCase() === nom.toLowerCase() &&
                        p.prenom.toLowerCase() === prenom.toLowerCase()
                    )
                    if (patient) {
                        patientId = patient.id
                    }
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
            
         // Générer un numéro de facture unique
            const dateFact = row.date_facture || row.date || new Date().toISOString().split('T')[0]
            const year = dateFact.substring(0, 4)
            const uniqueSuffix = Date.now().toString().slice(-6) + i.toString().padStart(2, '0')
            const numeroFacture = row.numero_facture || row.numero || `${year}-${uniqueSuffix}`
            
            const invoiceData = {
                patient_id: patientId,
                numero_facture: numeroFacture,
                date_facture: dateFact,
                montant: parseFloat(row.montant || row.amount || 0),
                statut: row.statut || row.status || 'en_attente',
                mode_paiement: row.mode_paiement || row.payment_method || null,
                date_paiement: row.date_paiement || row.payment_date || null,
                description: row.description || null,
                notes: row.notes || null
            }
            
            const result = await createInvoice(invoiceData)
            if (result.success) {
                results.success++
                results.details.push({
                    row: i + 2,
                    status: 'success',
                    message: `Facture de ${invoiceData.montant} DH importée`
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
