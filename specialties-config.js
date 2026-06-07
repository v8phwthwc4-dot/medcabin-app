// ===== SPECIALTIES CONFIG =====
// Configuration centrale de toutes les spécialités
// Pour ajouter une spécialité : ajouter une entrée dans SPECIALTIES

export const SPECIALTIES = {
    generaliste: {
        label: 'Médecin Généraliste',
        icon: '🩺',
        color: '#667eea',
        defaultDuration: 30,
        appointmentTypes: ['consultation', 'suivi', 'urgence', 'controle', 'vaccination'],
        customFields: [],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    pediatre: {
        label: 'Pédiatre',
        icon: '👶',
        color: '#10b981',
        defaultDuration: 20,
        appointmentTypes: ['consultation', 'vaccination', 'controle_croissance', 'urgence'],
        customFields: [
            { name: 'poids_naissance', label: 'Poids à la naissance (kg)', type: 'number' },
            { name: 'taille_naissance', label: 'Taille à la naissance (cm)', type: 'number' },
            { name: 'allaitement', label: 'Type d\'allaitement', type: 'select', options: ['Sein', 'Biberon', 'Mixte', 'Sevré'] },
            { name: 'allergies', label: 'Allergies connues', type: 'textarea' },
            { name: 'vaccins_a_jour', label: 'Vaccins à jour', type: 'boolean' }
        ],
        dashboardWidgets: ['rdv_today', 'vaccins_due', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices', 'growth_chart']
    },
    gynecologue: {
        label: 'Gynécologue-Obstétricien',
        icon: '👩‍⚕️',
        color: '#ec4899',
        defaultDuration: 30,
        appointmentTypes: ['consultation', 'suivi_grossesse', 'echographie', 'frottis', 'urgence'],
        customFields: [
            { name: 'ddr', label: 'Date dernières règles', type: 'date' },
            { name: 'gravidite', label: 'Gravidité (G)', type: 'number' },
            { name: 'parite', label: 'Parité (P)', type: 'number' },
            { name: 'contraception', label: 'Contraception', type: 'select', options: ['Aucune', 'Pilule', 'DIU', 'Implant', 'Préservatif', 'Stérilet', 'Autre'] },
            { name: 'antecedents_obstetricaux', label: 'Antécédents obstétricaux', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'grossesses_actives', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices', 'pregnancy_tracking']
    },
    dentiste: {
        label: 'Dentiste / Chirurgien-Dentiste',
        icon: '🦷',
        color: '#06b6d4',
        defaultDuration: 45,
        appointmentTypes: ['consultation', 'detartrage', 'soin_carie', 'extraction', 'prothese', 'orthodontie', 'urgence'],
        customFields: [
            { name: 'derniere_visite', label: 'Dernière visite', type: 'date' },
            { name: 'schema_dentaire', label: 'Schéma dentaire / dents traitées', type: 'textarea' },
            { name: 'bruxisme', label: 'Bruxisme', type: 'boolean' },
            { name: 'sensibilite', label: 'Sensibilité dentaire', type: 'boolean' },
            { name: 'plan_traitement', label: 'Plan de traitement', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'devis_en_cours', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices', 'dental_chart']
    },
    cardiologue: {
        label: 'Cardiologue',
        icon: '❤️',
        color: '#ef4444',
        defaultDuration: 45,
        appointmentTypes: ['consultation', 'ecg', 'echo_cardiaque', 'epreuve_effort', 'holter', 'urgence'],
        customFields: [
            { name: 'tension_systolique', label: 'Tension systolique (mmHg)', type: 'number' },
            { name: 'tension_diastolique', label: 'Tension diastolique (mmHg)', type: 'number' },
            { name: 'frequence_cardiaque', label: 'Fréquence cardiaque (bpm)', type: 'number' },
            { name: 'cholesterol', label: 'Cholestérol total (g/L)', type: 'number' },
            { name: 'antecedents_cardiaques', label: 'Antécédents familiaux cardiaques', type: 'textarea' },
            { name: 'tabac', label: 'Tabagisme', type: 'boolean' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_risque', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    dermatologue: {
        label: 'Dermatologue',
        icon: '🧴',
        color: '#f59e0b',
        defaultDuration: 20,
        appointmentTypes: ['consultation', 'controle_grains_beaute', 'biopsie', 'cryotherapie', 'urgence'],
        customFields: [
            { name: 'phototype', label: 'Phototype', type: 'select', options: ['I', 'II', 'III', 'IV', 'V', 'VI'] },
            { name: 'antecedents_melanome', label: 'Antécédents familiaux mélanome', type: 'boolean' },
            { name: 'allergies_topiques', label: 'Allergies topiques', type: 'textarea' },
            { name: 'traitements_en_cours', label: 'Traitements dermato en cours', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    ophtalmologue: {
        label: 'Ophtalmologue',
        icon: '👁️',
        color: '#8b5cf6',
        defaultDuration: 30,
        appointmentTypes: ['consultation', 'fond_oeil', 'champ_visuel', 'tonometrie', 'controle_lunettes', 'urgence'],
        customFields: [
            { name: 'acuite_od', label: 'Acuité Œil Droit', type: 'text' },
            { name: 'acuite_og', label: 'Acuité Œil Gauche', type: 'text' },
            { name: 'port_lunettes', label: 'Porte des lunettes', type: 'boolean' },
            { name: 'port_lentilles', label: 'Porte des lentilles', type: 'boolean' },
            { name: 'antecedents_glaucome', label: 'Antécédents familiaux glaucome', type: 'boolean' },
            { name: 'derniere_correction', label: 'Dernière correction', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    orl: {
        label: 'ORL (Oto-Rhino-Laryngologiste)',
        icon: '👂',
        color: '#0ea5e9',
        defaultDuration: 25,
        appointmentTypes: ['consultation', 'audiogramme', 'endoscopie', 'lavage_oreille', 'urgence'],
        customFields: [
            { name: 'audition_od', label: 'Audition Oreille Droite', type: 'text' },
            { name: 'audition_og', label: 'Audition Oreille Gauche', type: 'text' },
            { name: 'acouphenes', label: 'Acouphènes', type: 'boolean' },
            { name: 'allergies_respiratoires', label: 'Allergies respiratoires', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    psychiatre: {
        label: 'Psychiatre / Psychologue',
        icon: '🧠',
        color: '#a855f7',
        defaultDuration: 50,
        appointmentTypes: ['consultation_initiale', 'suivi', 'therapie', 'urgence'],
        customFields: [
            { name: 'motif_principal', label: 'Motif principal', type: 'textarea' },
            { name: 'traitement_actuel', label: 'Traitement en cours', type: 'textarea' },
            { name: 'antecedents_psy', label: 'Antécédents psychiatriques', type: 'textarea' },
            { name: 'risque_suicide', label: 'Évaluation du risque', type: 'select', options: ['Faible', 'Modéré', 'Élevé'] }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    kinesitherapeute: {
        label: 'Kinésithérapeute',
        icon: '💪',
        color: '#22c55e',
        defaultDuration: 30,
        appointmentTypes: ['bilan', 'seance', 'reeducation', 'massage'],
        customFields: [
            { name: 'pathologie_principale', label: 'Pathologie principale', type: 'textarea' },
            { name: 'douleur_echelle', label: 'Échelle douleur (0-10)', type: 'number' },
            { name: 'seances_prescrites', label: 'Nombre de séances prescrites', type: 'number' },
            { name: 'seances_effectuees', label: 'Séances effectuées', type: 'number' },
            { name: 'medecin_prescripteur', label: 'Médecin prescripteur', type: 'text' }
        ],
        dashboardWidgets: ['rdv_today', 'seances_en_cours', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'invoices']
    },
    neurologue: {
        label: 'Neurologue',
        icon: '🧬',
        color: '#6366f1',
        defaultDuration: 45,
        appointmentTypes: ['consultation', 'eeg', 'emg', 'controle', 'urgence'],
        customFields: [
            { name: 'pathologie_neuro', label: 'Pathologie neurologique', type: 'textarea' },
            { name: 'crises_epilepsie', label: 'Crises d\'épilepsie', type: 'boolean' },
            { name: 'derniere_crise', label: 'Dernière crise', type: 'date' },
            { name: 'traitement_neuro', label: 'Traitement neurologique', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    rhumatologue: {
        label: 'Rhumatologue',
        icon: '🦴',
        color: '#f97316',
        defaultDuration: 35,
        appointmentTypes: ['consultation', 'infiltration', 'controle', 'urgence'],
        customFields: [
            { name: 'articulations_touchees', label: 'Articulations touchées', type: 'textarea' },
            { name: 'douleur_echelle', label: 'Échelle douleur (0-10)', type: 'number' },
            { name: 'raideur_matinale', label: 'Raideur matinale (min)', type: 'number' },
            { name: 'traitement_actuel', label: 'Traitement actuel', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    gastroenterologue: {
        label: 'Gastro-entérologue',
        icon: '🫃',
        color: '#84cc16',
        defaultDuration: 30,
        appointmentTypes: ['consultation', 'fibroscopie', 'coloscopie', 'controle', 'urgence'],
        customFields: [
            { name: 'symptomes_digestifs', label: 'Symptômes digestifs', type: 'textarea' },
            { name: 'derniere_coloscopie', label: 'Dernière coloscopie', type: 'date' },
            { name: 'antecedents_familiaux_cancer', label: 'ATCD familiaux cancer digestif', type: 'boolean' },
            { name: 'regime_alimentaire', label: 'Régime alimentaire', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    urologue: {
        label: 'Urologue',
        icon: '💧',
        color: '#14b8a6',
        defaultDuration: 30,
        appointmentTypes: ['consultation', 'echographie', 'cystoscopie', 'controle', 'urgence'],
        customFields: [
            { name: 'antecedents_uro', label: 'Antécédents urologiques', type: 'textarea' },
            { name: 'psa', label: 'PSA (ng/mL)', type: 'number' },
            { name: 'symptomes_urinaires', label: 'Symptômes urinaires', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    endocrinologue: {
        label: 'Endocrinologue / Diabétologue',
        icon: '🩸',
        color: '#dc2626',
        defaultDuration: 35,
        appointmentTypes: ['consultation', 'controle_diabete', 'controle_thyroide', 'urgence'],
        customFields: [
            { name: 'glycemie_jeun', label: 'Glycémie à jeun (g/L)', type: 'number' },
            { name: 'hba1c', label: 'HbA1c (%)', type: 'number' },
            { name: 'tsh', label: 'TSH (mUI/L)', type: 'number' },
            { name: 'type_diabete', label: 'Type de diabète', type: 'select', options: ['Aucun', 'Type 1', 'Type 2', 'Gestationnel'] },
            { name: 'insuline', label: 'Sous insuline', type: 'boolean' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_diabetiques', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    pneumologue: {
        label: 'Pneumologue',
        icon: '🫁',
        color: '#0891b2',
        defaultDuration: 30,
        appointmentTypes: ['consultation', 'spirometrie', 'gaz_sang', 'controle', 'urgence'],
        customFields: [
            { name: 'tabagisme', label: 'Tabagisme', type: 'select', options: ['Jamais', 'Ancien', 'Actuel'] },
            { name: 'paquets_annees', label: 'Paquets-années', type: 'number' },
            { name: 'asthme', label: 'Asthme', type: 'boolean' },
            { name: 'bpco', label: 'BPCO', type: 'boolean' },
            { name: 'traitement_pulmo', label: 'Traitement pulmonaire', type: 'textarea' }
        ],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    },
    autre: {
        label: 'Autre spécialité',
        icon: '⚕️',
        color: '#64748b',
        defaultDuration: 30,
        appointmentTypes: ['consultation', 'suivi', 'urgence', 'controle'],
        customFields: [],
        dashboardWidgets: ['rdv_today', 'patients_recent', 'revenus_mois'],
        modules: ['patients', 'appointments', 'prescriptions', 'invoices']
    }
}

// ===== HELPERS =====

export function getSpecialty(key) {
    return SPECIALTIES[key] || SPECIALTIES.generaliste
}

export function getAllSpecialties() {
    return Object.entries(SPECIALTIES).map(([key, value]) => ({ key, ...value }))
}

export function getCustomFieldsFor(specialty) {
    return SPECIALTIES[specialty]?.customFields || []
}

export function getModulesFor(specialty) {
    return SPECIALTIES[specialty]?.modules || ['patients', 'appointments', 'prescriptions', 'invoices']
}

export function getAppointmentTypesFor(specialty) {
    return SPECIALTIES[specialty]?.appointmentTypes || ['consultation', 'suivi', 'urgence']
}

console.log('✅ Specialties Config chargée')
