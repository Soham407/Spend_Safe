-- ============================================================================
-- Flow 3: Database Migration
-- Add last_reality_check field to users table
-- ============================================================================

-- Add the new column to track reality check acknowledgments
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reality_check TIMESTAMPTZ;

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_users_last_reality_check ON users(last_reality_check);

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name = 'last_reality_check';
