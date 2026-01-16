-- ============================================================================
-- Migration: Create RPC function for atomic income event creation
-- Fixes: Critical Issue 2 (Missing atomic transaction)
-- ============================================================================
CREATE OR REPLACE FUNCTION create_income_event_with_assumption(
        p_user_id UUID,
        p_amount DECIMAL,
        p_event_date DATE,
        p_savings_rate DECIMAL
    ) RETURNS TABLE(income_event_id UUID, assumption_id UUID) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_income_id UUID;
v_assumption_id UUID;
BEGIN -- Insert Income Event
INSERT INTO income_events (user_id, amount, event_date, savings_rate)
VALUES (
        p_user_id,
        p_amount,
        p_event_date,
        p_savings_rate
    )
RETURNING id INTO v_income_id;
-- Insert Initial Pending Assumption
INSERT INTO assumptions (income_event_id, state)
VALUES (v_income_id, 'pending')
RETURNING id INTO v_assumption_id;
-- Return both IDs
RETURN QUERY
SELECT v_income_id,
    v_assumption_id;
END;
$$;