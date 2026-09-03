-- Execute as the database owner after all migrations. Every fixture is rolled back.
begin;

select set_config('test.owner_id', gen_random_uuid()::text, true);
select set_config('test.admin_id', gen_random_uuid()::text, true);
select set_config('test.editor_id', gen_random_uuid()::text, true);
select set_config('test.outsider_id', gen_random_uuid()::text, true);

insert into public.dashboard_access (email, role, is_active)
values ('owner-access-test@example.com', 'owner', true);

insert into auth.users (id, email, raw_user_meta_data)
values (
  current_setting('test.owner_id')::uuid,
  'owner-access-test@example.com',
  '{"full_name":"Owner access test"}'::jsonb
);

do $$
begin
  if not exists (
    select 1 from public.profiles
    where id = current_setting('test.owner_id')::uuid and role = 'admin'
  ) then
    raise exception 'Authorized signup did not create an owner-compatible profile';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', current_setting('test.owner_id'), true);
set local role authenticated;
insert into public.dashboard_access (email, role, is_active)
values ('admin-access-test@example.com', 'admin', true);
reset role;

insert into auth.users (id, email)
values (current_setting('test.admin_id')::uuid, 'admin-access-test@example.com');

select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
set local role authenticated;
do $$
begin
  if private.dashboard_role() <> 'admin' then
    raise exception 'Admin role resolution failed';
  end if;
  insert into public.dashboard_access (email, role, is_active)
  values ('editor-access-test@example.com', 'editor', true);
  begin
    insert into public.dashboard_access (email, role, is_active)
    values ('owner-escalation-test@example.com', 'owner', true);
    raise exception 'Admin granted owner access';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;

insert into auth.users (id, email)
values (current_setting('test.editor_id')::uuid, 'editor-access-test@example.com');

select set_config('request.jwt.claim.sub', current_setting('test.editor_id'), true);
set local role authenticated;
do $$
begin
  if not private.is_content_editor() or private.is_admin() then
    raise exception 'Editor authorization failed';
  end if;
  begin
    insert into public.dashboard_access (email, role)
    values ('forbidden-access-test@example.com', 'editor');
    raise exception 'Editor granted dashboard access';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;

update public.dashboard_access
set is_active = false
where registered_user_id = current_setting('test.editor_id')::uuid;

set local role authenticated;
do $$
begin
  if private.is_content_editor() then
    raise exception 'Disabled editor retained content access';
  end if;
end;
$$;
reset role;

insert into auth.users (id, email)
values (current_setting('test.outsider_id')::uuid, 'outsider-access-test@example.com');

select set_config('request.jwt.claim.sub', current_setting('test.outsider_id'), true);
set local role authenticated;
do $$
begin
  if private.dashboard_role() is not null or private.is_content_editor() then
    raise exception 'Unlisted Auth user received dashboard access';
  end if;
end;
$$;
reset role;

insert into public.dashboard_access (email, role, is_active)
values ('waiting-access-test@example.com', 'editor', true);

set local role anon;
do $$
begin
  if public.can_register_dashboard_user('unknown-access-test@example.com') then
    raise exception 'Unknown email passed registration check';
  end if;
  if not public.can_register_dashboard_user('waiting-access-test@example.com') then
    raise exception 'Pending authorized email failed registration check';
  end if;
end;
$$;
reset role;

rollback;
