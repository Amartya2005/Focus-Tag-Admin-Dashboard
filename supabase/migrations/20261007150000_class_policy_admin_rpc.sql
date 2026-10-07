-- Publish immutable, institution-scoped class app policies for the Android enforcement client.
CREATE OR REPLACE FUNCTION public.set_class_app_policy(
    p_class_id UUID,
    p_packages TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_role TEXT;
    v_caller_inst UUID;
    v_class_inst UUID;
    v_policy_id UUID;
    v_version TEXT;
    v_packages TEXT[];
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    SELECT role, institution_id
    INTO v_caller_role, v_caller_inst
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_caller_role IS DISTINCT FROM 'admin' OR v_caller_inst IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    SELECT institution_id
    INTO v_class_inst
    FROM public.classes
    WHERE id = p_class_id;

    IF NOT FOUND OR v_class_inst IS DISTINCT FROM v_caller_inst THEN
        RAISE EXCEPTION 'Class not found or not eligible';
    END IF;

    v_packages := ARRAY(
        SELECT DISTINCT lower(trim(pkg))
        FROM unnest(COALESCE(p_packages, ARRAY[]::TEXT[])) AS pkg
        WHERE trim(pkg) <> ''
        ORDER BY lower(trim(pkg))
    );

    IF cardinality(v_packages) > 200 THEN
        RAISE EXCEPTION 'A class policy may contain at most 200 packages';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM unnest(v_packages) AS pkg
        WHERE pkg !~ '^[a-z0-9_][a-z0-9_.-]{0,127}$'
    ) THEN
        RAISE EXCEPTION 'Invalid Android package name';
    END IF;

    v_version := 'v' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS')
        || '-' || substring(replace(gen_random_uuid()::TEXT, '-', '') FROM 1 FOR 8);

    INSERT INTO public.class_app_policies (institution_id, class_id, version, updated_at)
    VALUES (v_caller_inst, p_class_id, v_version, now())
    RETURNING id INTO v_policy_id;

    IF cardinality(v_packages) > 0 THEN
        INSERT INTO public.class_app_policy_packages (policy_id, package_name, action)
        SELECT v_policy_id, pkg, 'BLOCK'
        FROM unnest(v_packages) AS pkg;
    END IF;

    RETURN jsonb_build_object(
        'version', v_version,
        'package_count', cardinality(v_packages)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.set_class_app_policy(UUID, TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_class_app_policy(UUID, TEXT[]) TO authenticated;
