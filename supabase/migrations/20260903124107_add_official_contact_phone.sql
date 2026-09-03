-- Store the official phone alongside the existing public contact links.
do $$
begin
  if not exists (
    select 1 from public.site_settings
    where key = 'social_links' and is_public and jsonb_typeof(value) = 'array'
  ) then
    raise exception 'The public social_links setting must exist before adding the phone number';
  end if;

  update public.site_settings as settings
  set value = (
    select jsonb_agg(links.item order by links.position)
    from (
      select entry.item, entry.ordinality * 2 as position
      from jsonb_array_elements(settings.value) with ordinality as entry(item, ordinality)
      where entry.item->>'href' is distinct from 'tel:+970597902161'
      union all
      select jsonb_build_object(
        'label', 'Phone',
        'value', '+970 597 902 161',
        'href', 'tel:+970597902161'
      ), 3
    ) as links
  )
  where settings.key = 'social_links';
end
$$;
