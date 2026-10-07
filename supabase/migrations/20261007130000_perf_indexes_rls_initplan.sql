-- Perf pass: indexes for filters/joins used by the dashboard + advisor FKs,
-- and RLS initplan fixes (auth.uid() -> (select auth.uid())). Semantics unchanged.
-- Already present: enrollments(class_id), enrollments PK(student_id,class_id),
-- classes(institution_id), teacher_class_access PK(teacher_id,class_id) + (class_id),
-- focus_sessions(user_id), profiles(institution_id).

create index if not exists idx_profiles_institution_role on public.profiles (institution_id, role);
create index if not exists idx_profiles_role_name on public.profiles (role, name);
create index if not exists idx_enrollments_student_id on public.enrollments (student_id);
create index if not exists idx_classes_created_at on public.classes (created_at desc);
create index if not exists idx_focus_sessions_user_status_end on public.focus_sessions (user_id, status, end_at);
create index if not exists idx_focus_sessions_classroom_id on public.focus_sessions (classroom_id);
create index if not exists idx_class_app_policies_institution_id on public.class_app_policies (institution_id);
create index if not exists idx_interception_events_user_id on public.interception_events (user_id);
create index if not exists idx_iot_devices_location_id on public.iot_devices (location_id);
create index if not exists idx_tap_idempotency_session_id on public.tap_idempotency (session_id);

alter policy "class_app_policies_select" on public.class_app_policies using (
  exists (select 1 from public.enrollments e where e.class_id = class_app_policies.class_id and e.student_id = (select auth.uid()))
  or exists (select 1 from public.teacher_class_access t where t.class_id = class_app_policies.class_id and t.teacher_id = (select auth.uid()))
);

alter policy "class_app_policy_packages_select" on public.class_app_policy_packages using (
  exists (select 1 from public.class_app_policies p join public.enrollments e on e.class_id = p.class_id and e.student_id = (select auth.uid())
          where p.id = class_app_policy_packages.policy_id)
  or exists (select 1 from public.class_app_policies p join public.teacher_class_access t on t.class_id = p.class_id and t.teacher_id = (select auth.uid())
          where p.id = class_app_policy_packages.policy_id)
);

alter policy "Profiles are visible to self, authorized teachers, and admins" on public.profiles using (
  (id = (select auth.uid()))
  or ((select public.get_auth_role()) = 'admin' and institution_id = (select public.get_auth_institution()))
  or ((select public.get_auth_role()) = 'teacher' and public.is_teacher_of_student(id))
);

alter policy "Users can update their own name only" on public.profiles
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and not (role is distinct from public.get_auth_role())
    and not (institution_id is distinct from public.get_auth_institution())
  );

alter policy "Enrollments are visible to participants and admins" on public.enrollments using (
  (student_id = (select auth.uid()))
  or ((select public.get_auth_role()) = 'admin' and public.is_class_in_auth_institution(class_id))
  or ((select public.get_auth_role()) = 'teacher' and public.is_teacher_of_class(class_id))
);

alter policy "Teacher access is visible to self and admins" on public.teacher_class_access using (
  (teacher_id = (select auth.uid()))
  or ((select public.get_auth_role()) = 'admin' and public.is_class_in_auth_institution(class_id))
);
