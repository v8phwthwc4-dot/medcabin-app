// ===== NOTIFICATIONS & ALERTES API =====
// Système modulaire - facile d'ajouter de nouveaux types

import { supabase } from './supabase-client.js'

// ===== RÉCUPÉRER TOUTES LES ALERTES (warnings critiques) =====
export async function getAlerts() {
    const alerts = []
    
    // ALERTE 1 : Conflits d'horaire aujourd'hui
    try {
        const today = new Date().toISOString().split('T')[0]
        const { data } = await supabase
            .from('appointments')
            .select(`*, patient:patients(id, nom, prenom, telephone)`)
            .eq('date', today)
            .neq('statut', 'annule')
            .order('heure_debut', { ascending: true })
        
        if (data) {
            for (let i = 0; i < data.length; i++) {
                for (let j = i + 1; j < data.length; j++) {
                    const a = data[i], b = data[j]
                    if (a.heure_debut < b.heure_fin && b.heure_debut < a.heure_fin) {
                        alerts.push({
                            id: `conflict_${a.id}_${b.id}`,
                            type: 'conflict',
                            icon: '⚠️',
                            title: 'Conflit RDV',
                            message: `${a.patient?.prenom} ${a.patient?.nom} et ${b.patient?.prenom} ${b.patient?.nom} à ${a.heure_debut.substring(0,5)}`,
                            phones: [a.patient?.telephone, b.patient?.telephone].filter(Boolean),
                            link: 'appointments.html',
                            priority: 'high'
                        })
                    }
                }
            }
        }
    } catch (e) { console.error('Erreur conflits:', e) }
    
    // ALERTE 2 : Factures impayées (placeholder pour évolution future)
    try {
        const { data } = await supabase
            .from('invoices')
            .select('id, montant, patient:patients(nom, prenom)')
            .eq('statut', 'impayee')
            .limit(5)
        
        if (data && data.length > 0) {
            alerts.push({
                id: 'unpaid_invoices',
                type: 'unpaid',
                icon: '💰',
                title: `${data.length} facture(s) impayée(s)`,
                message: `Total à recouvrer`,
                link: 'invoices.html',
                priority: 'medium'
            })
        }
    } catch (e) { console.error('Erreur factures:', e) }
    
    return { success: true, alerts }
}

// ===== RÉCUPÉRER TOUTES LES NOTIFICATIONS (infos générales) =====
export async function getNotifications() {
    const notifications = []
    
    // NOTIF 1 : RDV à venir dans l'heure
    try {
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const currentTime = now.toTimeString().substring(0, 8)
        const oneHourLater = new Date(now.getTime() + 60*60*1000).toTimeString().substring(0, 8)
        
        const { data } = await supabase
            .from('appointments')
            .select(`*, patient:patients(nom, prenom)`)
            .eq('date', today)
            .gte('heure_debut', currentTime)
            .lte('heure_debut', oneHourLater)
            .neq('statut', 'annule')
        
        if (data) {
            data.forEach(rdv => {
                notifications.push({
                    id: `upcoming_${rdv.id}`,
                    type: 'upcoming',
                    icon: '🕐',
                    title: 'RDV imminent',
                    message: `${rdv.patient?.prenom} ${rdv.patient?.nom} à ${rdv.heure_debut.substring(0,5)}`,
                    link: `appointment-detail.html?id=${rdv.id}`,
                    time: rdv.heure_debut
                })
            })
        }
    } catch (e) { console.error('Erreur RDV imminents:', e) }
    
    // NOTIF 2 : Nouveaux patients ajoutés aujourd'hui
    try {
        const today = new Date().toISOString().split('T')[0]
        const { data } = await supabase
            .from('patients')
            .select('id, nom, prenom, created_at')
            .gte('created_at', today + 'T00:00:00')
        
        if (data && data.length > 0) {
            notifications.push({
                id: 'new_patients_today',
                type: 'new_patient',
                icon: '👥',
                title: `${data.length} nouveau(x) patient(s)`,
                message: 'Ajoutés aujourd\'hui',
                link: 'patients.html'
            })
        }
    } catch (e) { console.error('Erreur nouveaux patients:', e) }
    
    return { success: true, notifications }
}

// ===== MARQUER COMME LU (localStorage) =====
export function markAsRead(id) {
    const today = new Date().toISOString().split('T')[0]
    const key = `medcabin_read_${today}`
    const read = JSON.parse(localStorage.getItem(key) || '[]')
    if (!read.includes(id)) {
        read.push(id)
        localStorage.setItem(key, JSON.stringify(read))
    }
}

export function isRead(id) {
    const today = new Date().toISOString().split('T')[0]
    const key = `medcabin_read_${today}`
    const read = JSON.parse(localStorage.getItem(key) || '[]')
    return read.includes(id)
}

export function clearAllRead() {
    const today = new Date().toISOString().split('T')[0]
    localStorage.removeItem(`medcabin_read_${today}`)
}

console.log('✅ Notifications API chargée')
