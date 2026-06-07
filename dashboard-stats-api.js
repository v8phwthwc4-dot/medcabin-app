// ===== DASHBOARD STATS API =====
// Calcul de toutes les statistiques pour le dashboard

import { supabase } from './supabase-client.js'

// ===== STATISTIQUES GLOBALES =====
export async function getDashboardStats() {
    try {
        // Récupérer toutes les données en parallèle
        const [patientsResult, appointmentsResult, invoicesResult] = await Promise.all([
            supabase.from('patients').select('*'),
            supabase.from('appointments').select('*'),
            supabase.from('invoices').select('*')
        ])
        
        const patients = patientsResult.data || []
        const appointments = appointmentsResult.data || []
        const invoices = invoicesResult.data || []
        
        const today = new Date().toISOString().split('T')[0]
        const thisMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
        
        // Calculs des statistiques
        const stats = {
            // Patients
            total_patients: patients.length,
            patients_hommes: patients.filter(p => p.sexe === 'M').length,
            patients_femmes: patients.filter(p => p.sexe === 'F').length,
            patients_recents: patients.slice(-5).reverse(), // 5 derniers
            
            // Rendez-vous
            rdv_today: appointments.filter(a => a.date === today).length,
            rdv_week: appointments.filter(a => {
                const date = new Date(a.date)
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
                return date >= weekStart
            }).length,
            rdv_confirmes: appointments.filter(a => a.statut === 'confirme').length,
            rdv_today_list: appointments
                .filter(a => a.date === today)
                .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut))
                .slice(0, 5),
            
            // Factures
            revenus_mois: invoices
                .filter(i => i.date_facture?.startsWith(thisMonth))
                .reduce((sum, i) => sum + parseFloat(i.montant || 0), 0),
            factures_payees: invoices.filter(i => i.statut === 'payee').length,
            factures_en_attente: invoices.filter(i => i.statut === 'en_attente').length,
            revenus_total: invoices
                .filter(i => i.statut === 'payee')
                .reduce((sum, i) => sum + parseFloat(i.montant || 0), 0),
            
            // Taux d'occupation (approximatif)
            taux_occupation: appointments.length > 0 
                ? Math.min(Math.round((appointments.filter(a => a.statut !== 'annule').length / appointments.length) * 100), 100)
                : 0
        }
        
        return { success: true, stats }
    } catch (error) {
        console.error('Erreur récupération stats:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== DONNÉES POUR GRAPHIQUE : Consultations des 7 derniers jours =====
export async function getConsultationsChart() {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('date, statut')
            .gte('date', getDateDaysAgo(7))
            .order('date', { ascending: true })
        
        if (error) throw error
        
        // Grouper par date
        const chartData = []
        for (let i = 6; i >= 0; i--) {
            const date = getDateDaysAgo(i)
            const count = data.filter(a => a.date === date && a.statut !== 'annule').length
            chartData.push({
                date,
                label: formatChartDate(date),
                count
            })
        }
        
        return { success: true, data: chartData }
    } catch (error) {
        console.error('Erreur graphique consultations:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== DONNÉES POUR GRAPHIQUE : Revenus des 6 derniers mois =====
export async function getRevenusChart() {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select('date_facture, montant, statut')
            .gte('date_facture', getDateMonthsAgo(6))
            .eq('statut', 'payee')
        
        if (error) throw error
        
        // Grouper par mois
        const chartData = []
        for (let i = 5; i >= 0; i--) {
            const monthStr = getMonthString(i)
            const montant = data
                .filter(inv => inv.date_facture?.startsWith(monthStr))
                .reduce((sum, inv) => sum + parseFloat(inv.montant || 0), 0)
            
            chartData.push({
                month: monthStr,
                label: formatMonthLabel(monthStr),
                montant: Math.round(montant)
            })
        }
        
        return { success: true, data: chartData }
    } catch (error) {
        console.error('Erreur graphique revenus:', error.message)
        return { success: false, error: error.message }
    }
}

// ===== UTILITAIRES =====

function getDateDaysAgo(days) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
}

function getDateMonthsAgo(months) {
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return date.toISOString().split('T')[0]
}

function getMonthString(monthsAgo) {
    const date = new Date()
    date.setMonth(date.getMonth() - monthsAgo)
    return date.toISOString().substring(0, 7) // YYYY-MM
}

function formatChartDate(dateStr) {
    const date = new Date(dateStr)
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return days[date.getDay()] + ' ' + date.getDate()
}

function formatMonthLabel(monthStr) {
    const [year, month] = monthStr.split('-')
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return months[parseInt(month) - 1]
}

export function formatMontant(montant) {
    return parseFloat(montant || 0).toFixed(0) + ' DH'
}

console.log('✅ Dashboard Stats API chargée')

// ===== DÉTECTER LES CONFLITS D'HORAIRE DU JOUR =====
export async function getTodayConflicts() {
    try {
        const today = new Date().toISOString().split('T')[0]
        
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                patient:patients(id, nom, prenom, telephone)
            `)
            .eq('date', today)
            .neq('statut', 'annule')
            .order('heure_debut', { ascending: true })
        
        if (error) throw error
        
        const conflicts = []
        for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                const a = data[i]
                const b = data[j]
                if (a.heure_debut < b.heure_fin && b.heure_debut < a.heure_fin) {
                    conflicts.push({
                        id: `${a.id}_${b.id}`,
                        appointment1: a,
                        appointment2: b
                    })
                }
            }
        }
        
        return { success: true, conflicts }
    } catch (error) {
        console.error('Erreur détection conflits:', error.message)
        return { success: false, error: error.message }
    }
}
