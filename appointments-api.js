// ===== APPOINTMENTS API =====
// Gestion complète des rendez-vous

import { supabase } from './supabase-client.js'

// ===== TYPES DE CONSULTATION =====
export const APPOINTMENT_TYPES = {
    CONSULTATION: 'consultation',
    SUIVI: 'suivi',
    URGENCE: 'urgence',
    CONTROLE: 'controle',
    VACCINATION: 'vaccination'
}

export const APPOINTMENT_TYPE_LABELS = {
    [APPOINTMENT_TYPES.CONSULTATION]: 'Consultation',
    [APPOINTMENT_TYPES.SUIVI]: 'Suivi',
    [APPOINTMENT_TYPES.URGENCE]: 'Urgence',
    [APPOINTMENT_TYPES.CONTROLE]: 'Contrôle',
    [APPOINTMENT_TYPES.VACCINATION]: 'Vaccination'
}

export const APPOINTMENT_TYPE_COLORS = {
    [APPOINTMENT_TYPES.CONSULTATION]: '#667eea',
    [APPOINTMENT_TYPES.SUIVI]: '#10b981',
    [APPOINTMENT_TYPES.URGENCE]: '#ef4444',
    [APPOINTMENT_TYPES.CONTROLE]: '#f59e0b',
    [APPOINTMENT_TYPES.VACCINATION]: '#8b5cf6'
}

// ===== STATUTS =====
export const APPOINTMENT_STATUS = {
    CONFIRME: 'confirme',
    EN_ATTENTE: 'en_attente',
    ANNULE: 'annule',
    TERMINE: 'termine',
    ABSENT: 'absent'
}

export const APPOINTMENT_STATUS_LABELS = {
    [APPOINTMENT_STATUS.CONFIRME]: 'Confirmé',
    [APPOINTMENT_STATUS.EN_ATTENTE]: 'En attente',
    [APPOINTMENT_STATUS.ANNULE]: 'Annulé',
    [APPOINTMENT_STATUS.TERMINE]: 'Terminé',
    [APPOINTMENT_STATUS.ABSENT]: 'Absent'
}

// ===== RÉCUPÉRER TOUS LES RDV =====
export async function getAllAppointments() {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone)
            `)
            .order('date', { ascending: true })
            .order('heure_debut', { ascending: true })
        
        if (error) throw error
        return { success: true, appointments: data }
    } catch (error) {
        console.error('Erreur récupération RDV:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER LES RDV D'UNE PÉRIODE =====
export async function getAppointmentsByDateRange(startDate, endDate) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone)
            `)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: true })
            .order('heure_debut', { ascending: true })
        
        if (error) throw error
        return { success: true, appointments: data }
    } catch (error) {
        console.error('Erreur récupération RDV période:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== RÉCUPÉRER LES RDV DU JOUR =====
export async function getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0]
    return getAppointmentsByDateRange(today, today)
}

// ===== RÉCUPÉRER UN RDV PAR ID =====
export async function getAppointmentById(appointmentId) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone, date_naissance, sexe)
            `)
            .eq('id', appointmentId)
            .single()
        
        if (error) throw error
        return { success: true, appointment: data }
    } catch (error) {
        console.error('Erreur récupération RDV:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== CRÉER UN RDV =====
export async function createAppointment(appointmentData) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error('Utilisateur non connecté')
        
        // Vérifier les conflits d'horaire
        const conflict = await checkTimeConflict(
            appointmentData.date,
            appointmentData.heure_debut,
            appointmentData.heure_fin
        )
        
        if (conflict) {
            return { 
                success: false, 
                error: 'Un rendez-vous existe déjà à cet horaire' 
            }
        }
        
        const { data, error } = await supabase
            .from('appointments')
            .insert([{
                ...appointmentData,
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
        return { success: true, appointment: data }
    } catch (error) {
        console.error('Erreur création RDV:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== METTRE À JOUR UN RDV =====
export async function updateAppointment(appointmentId, appointmentData) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .update({
                ...appointmentData,
                updated_at: new Date().toISOString()
            })
            .eq('id', appointmentId)
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone)
            `)
            .single()
        
        if (error) throw error
        return { success: true, appointment: data }
    } catch (error) {
        console.error('Erreur mise à jour RDV:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== SUPPRIMER UN RDV =====
export async function deleteAppointment(appointmentId) {
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appointmentId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Erreur suppression RDV:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== CHANGER LE STATUT D'UN RDV =====
export async function updateAppointmentStatus(appointmentId, newStatus) {
    return updateAppointment(appointmentId, { statut: newStatus })
}

// ===== VÉRIFIER LES CONFLITS D'HORAIRE =====
async function checkTimeConflict(date, heureDebut, heureFin, excludeId = null) {
    try {
        let query = supabase
            .from('appointments')
            .select('id')
            .eq('date', date)
            .neq('statut', APPOINTMENT_STATUS.ANNULE)
            .or(`heure_debut.lte.${heureFin},heure_fin.gte.${heureDebut}`)
        
        if (excludeId) {
            query = query.neq('id', excludeId)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        return data && data.length > 0
    } catch (error) {
        console.error('Erreur vérification conflit:', error.message)
        return false
    }
}

// ===== RÉCUPÉRER LES RDV D'UN PATIENT =====
export async function getPatientAppointments(patientId) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('patient_id', patientId)
            .order('date', { ascending: false })
        
        if (error) throw error
        return { success: true, appointments: data }
    } catch (error) {
        console.error('Erreur récupération RDV patient:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== STATISTIQUES =====
export async function getAppointmentStats(startDate, endDate) {
    try {
        const result = await getAppointmentsByDateRange(startDate, endDate)
        
        if (!result.success) return result
        
        const appointments = result.appointments
        
        const stats = {
            total: appointments.length,
            confirmes: appointments.filter(a => a.statut === APPOINTMENT_STATUS.CONFIRME).length,
            termines: appointments.filter(a => a.statut === APPOINTMENT_STATUS.TERMINE).length,
            annules: appointments.filter(a => a.statut === APPOINTMENT_STATUS.ANNULE).length,
            absents: appointments.filter(a => a.statut === APPOINTMENT_STATUS.ABSENT).length,
            byType: {}
        }
        
        // Stats par type
        Object.values(APPOINTMENT_TYPES).forEach(type => {
            stats.byType[type] = appointments.filter(a => a.type === type).length
        })
        
        return { success: true, stats }
    } catch (error) {
        console.error('Erreur stats RDV:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== UTILITAIRES =====

// Formater l'heure (HH:MM → HH:MM)
export function formatTime(time) {
    if (!time) return ''
    return time.substring(0, 5) // Garde seulement HH:MM
}

// Calculer la durée en minutes
export function calculateDuration(heureDebut, heureFin) {
    const [h1, m1] = heureDebut.split(':').map(Number)
    const [h2, m2] = heureFin.split(':').map(Number)
    return (h2 * 60 + m2) - (h1 * 60 + m1)
}

// Générer les créneaux horaires
export function generateTimeSlots(startHour = 8, endHour = 20, intervalMinutes = 30) {
    const slots = []
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += intervalMinutes) {
            const hour = h.toString().padStart(2, '0')
            const minute = m.toString().padStart(2, '0')
            slots.push(`${hour}:${minute}`)
        }
    }
    return slots
}

console.log('✅ Appointments API chargée')
