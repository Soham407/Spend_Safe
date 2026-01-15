-- ============================================================================
-- SpendSafe Database Schema
-- Generated strictly from PRD.md and TRD.md
-- ============================================================================
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================================================
-- USERS TABLE
-- PRD: "User Owns all data and assumptions, defines all rates and timing"
-- TRD Section 2: "User - Owns all data and assumptions"
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_passive_mode BOOLEAN NOT NULL DEFAULT FALSE,
    last_reality_check TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Index for user lookups
CREATE INDEX idx_users_created_at ON users(created_at);
-- Sync Trigger for auth.users -> public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
INSERT INTO public.users (id, created_at, updated_at)
VALUES (new.id, new.created_at, new.updated_at);
RETURN new;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- ============================================================================
-- INCOME EVENTS TABLE
-- PRD Section 3.1: "User records an income event (amount + date)"
-- PRD Section 3.1: "User assigns a self-defined savings rate"
-- TRD Section 2: "Income Event - Amount, Date, User-defined savings/allocation rate"
-- ============================================================================
CREATE TABLE income_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    event_date DATE NOT NULL,
    savings_rate DECIMAL(5, 4) NOT NULL CHECK (
        savings_rate >= 0
        AND savings_rate <= 1
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Indexes for income_events
CREATE INDEX idx_income_events_user_id ON income_events(user_id);
CREATE INDEX idx_income_events_event_date ON income_events(user_id, event_date);
CREATE INDEX idx_income_events_created_at ON income_events(created_at);
-- ============================================================================
-- ASSUMPTIONS TABLE
-- PRD Section 3.2: "I Did It" (confirmed) or "I Can't Right Now" (deferred)
-- TRD Section 2: "Assumption - Bound to a specific income event, has state"
-- TRD Section 4: States are Pending, Confirmed, Deferred
-- ============================================================================
-- TRD §2: States include invalidation for assumption evolution over time
CREATE TYPE assumption_state AS ENUM (
    'pending',
    'confirmed',
    'deferred',
    'invalidated'
);
CREATE TABLE assumptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    income_event_id UUID NOT NULL REFERENCES income_events(id) ON DELETE CASCADE,
    state assumption_state NOT NULL DEFAULT 'pending',
    state_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- TRD §2: Assumptions can be revised/invalidated over time
    -- Cardinality enforced via partial unique index below
);
-- Indexes for assumptions
CREATE INDEX idx_assumptions_income_event_id ON assumptions(income_event_id);
CREATE INDEX idx_assumptions_state ON assumptions(state);
CREATE INDEX idx_assumptions_state_changed_at ON assumptions(state_changed_at);
-- TRD §2: Allow temporal multiplicity but enforce only ONE active assumption per income event
CREATE UNIQUE INDEX one_active_assumption_per_income_event ON assumptions (income_event_id)
WHERE state IN ('pending', 'confirmed');
-- Composite index for "latest assumption" queries
CREATE INDEX idx_assumptions_income_event_latest ON assumptions(income_event_id, created_at DESC);
-- ============================================================================
-- Legacy pending_allocations table removed. State is managed on income_events.
CREATE INDEX idx_pending_allocations_created_at ON pending_allocations(created_at);
-- ============================================================================
-- REALITY CHECKS TABLE
-- PRD Section 3.3: "Periodic Reality Check prompts require the user to acknowledge"
-- TRD Section 2: "Reality Check - A forced acknowledgment event"
-- TRD Section 11: "Time-based acknowledgment prompts triggered by assumption staleness"
-- ============================================================================
-- TRD §2: Reality checks are "forced acknowledgment events" with behavioral outcomes
CREATE TYPE reality_check_outcome AS ENUM ('accepted', 'ignored', 'deferred');
CREATE TABLE reality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    outcome reality_check_outcome NOT NULL,
    acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Indexes for reality_checks
CREATE INDEX idx_reality_checks_user_id ON reality_checks(user_id);
CREATE INDEX idx_reality_checks_acknowledged_at ON reality_checks(user_id, acknowledged_at);
-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Users can only access their own data
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reality_checks ENABLE ROW LEVEL SECURITY;
-- Users table policies
CREATE POLICY users_select_own ON users FOR
SELECT USING (id = auth.uid());
CREATE POLICY users_insert_own ON users FOR
INSERT WITH CHECK (id = auth.uid());
CREATE POLICY users_update_own ON users FOR
UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY users_delete_own ON users FOR DELETE USING (id = auth.uid());
-- Income events policies
CREATE POLICY income_events_select_own ON income_events FOR
SELECT USING (user_id = auth.uid());
CREATE POLICY income_events_insert_own ON income_events FOR
INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY income_events_update_own ON income_events FOR
UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY income_events_delete_own ON income_events FOR DELETE USING (user_id = auth.uid());
-- Assumptions policies (accessed via income_events relationship)
CREATE POLICY assumptions_select_own ON assumptions FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM income_events
            WHERE income_events.id = assumptions.income_event_id
                AND income_events.user_id = auth.uid()
        )
    );
CREATE POLICY assumptions_insert_own ON assumptions FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM income_events
            WHERE income_events.id = assumptions.income_event_id
                AND income_events.user_id = auth.uid()
        )
    );
CREATE POLICY assumptions_update_own ON assumptions FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM income_events
            WHERE income_events.id = assumptions.income_event_id
                AND income_events.user_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1
            FROM income_events
            WHERE income_events.id = assumptions.income_event_id
                AND income_events.user_id = auth.uid()
        )
    );
CREATE POLICY assumptions_delete_own ON assumptions FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM income_events
        WHERE income_events.id = assumptions.income_event_id
            AND income_events.user_id = auth.uid()
    )
);
-- Reality checks policies
CREATE POLICY reality_checks_select_own ON reality_checks FOR
SELECT USING (user_id = auth.uid());
CREATE POLICY reality_checks_insert_own ON reality_checks FOR
INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY reality_checks_delete_own ON reality_checks FOR DELETE USING (user_id = auth.uid());
-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically updates the updated_at timestamp on row modifications
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Apply updated_at triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_events_updated_at BEFORE
UPDATE ON income_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assumptions_updated_at BEFORE
UPDATE ON assumptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();