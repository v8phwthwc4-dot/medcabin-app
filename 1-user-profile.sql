-- ============================================
-- MEDCABIN - Table user_profile
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Créer la table
CREATE TABLE IF NOT EXISTS user_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    specialite TEXT NOT NULL DEFAULT 'generaliste',
    practice_type TEXT DEFAULT 'solo',
    features JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Activer RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Users can view their own profile"
    ON user_profile FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profile FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profile FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
    ON user_profile FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Index
CREATE INDEX IF NOT EXISTS idx_user_profile_specialite ON user_profile(specialite);

-- ✅ Terminé !
