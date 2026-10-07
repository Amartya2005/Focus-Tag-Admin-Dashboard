CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS account_deletion_requests_insert ON public.account_deletion_requests;
CREATE POLICY account_deletion_requests_insert
    ON public.account_deletion_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(trim(email)) BETWEEN 3 AND 320
        AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
        AND (reason IS NULL OR length(reason) <= 2000)
    );

REVOKE ALL ON public.account_deletion_requests FROM anon, authenticated;
GRANT INSERT (email, reason) ON public.account_deletion_requests TO anon, authenticated;
