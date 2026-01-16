-- Atomic function to create income event and assumption
CREATE OR REPLACE FUNCTION create_income_event_with_assumption(
        p_user_id UUID,
        p_amount DECIMAL(15, 2),
        p_event_date DATE,
        p_savings_rate DECIMAL(5, 4)
    ) RETURNS TABLE (
        income_event_id UUID,
        assumption_id UUID
    ) AS $$
DECLARE v_income_id UUID;
v_assumption_id UUID;
BEGIN -- SECURITY: Lock down search_path to prevent object shadowing attacks
-- This is critical for SECURITY DEFINER functions to prevent privilege escalation
SET LOCAL search_path TO public,
    pg_temp;
-- Security check: Ensure user can only create records for themselves
-- Use IS DISTINCT FROM to handle NULL auth.uid() (unauthenticated users)
-- Schema-qualify auth.uid() to prevent shadowing
IF p_user_id IS DISTINCT
FROM auth.uid() THEN RAISE EXCEPTION 'Unauthorized: Cannot create income events for other users';
END IF;
-- Insert income event
INSERT INTO public.income_events (user_id, amount, event_date, savings_rate)
VALUES (
        p_user_id,
        p_amount,
        p_event_date,
        p_savings_rate
    )
RETURNING id INTO v_income_id;
-- Insert assumption (TRD: Always start as pending)
INSERT INTO public.assumptions (income_event_id, state)
VALUES (v_income_id, 'pending')
RETURNING id INTO v_assumption_id;
RETURN QUERY
SELECT v_income_id,
    v_assumption_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;