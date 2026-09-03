revoke all on public.profiles, public.site_settings, public.services,
  public.scenarios, public.scenario_steps, public.blog_categories,
  public.blog_posts, public.projects, public.project_gallery,
  public.partners, public.team_members, public.media_assets from anon;

grant select on public.site_settings, public.services, public.scenarios,
  public.scenario_steps, public.blog_categories, public.blog_posts,
  public.projects, public.project_gallery, public.partners,
  public.team_members, public.media_assets to anon;
