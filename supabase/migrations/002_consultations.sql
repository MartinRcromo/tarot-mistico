-- ============================================
-- Tarot Místico - Consultations Schema
-- ============================================

-- Tabla: consultations
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  calendly_event_uri TEXT,
  calendly_invitee_uri TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'canceled', 'no_show')),
  google_meet_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index para buscar consultas por usuario
CREATE INDEX idx_consultations_user_id ON consultations(user_id);

-- RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consultations"
  ON consultations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own consultations"
  ON consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Agregar campos de consulta semanal a profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  weekly_consultation_used BOOLEAN DEFAULT FALSE;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  weekly_consultation_reset_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days');
