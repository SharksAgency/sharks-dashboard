-- Seed only content already present in the SharksAgency website. No projects,
-- partners, clients, or team members are invented here.

insert into public.site_settings (key, value, is_public, description)
values
  (
    'site_identity',
    jsonb_build_object(
      'name', 'Sharks Agency',
      'shortName', 'Sharks',
      'location', 'Palestine',
      'email', 'hello@sharks.agency'
    ),
    true,
    'Public agency identity and contact details.'
  ),
  (
    'home_hero',
    jsonb_build_object(
      'lineOneBefore', 'لا نلاحق ',
      'highlight', 'الاتجاه',
      'lineOneAfter', '.',
      'lineTwo', 'نصنعه.',
      'ctaLabel', 'لنتحدث',
      'metaTop', 'Sharks Agency',
      'metaLocation', 'Palestine',
      'metaServices', 'Creative / Strategy / Digital'
    ),
    true,
    'Homepage hero copy.'
  ),
  (
    'home_manifesto',
    jsonb_build_object(
      'eyebrow', 'Sharks / Creative Agency / 2026',
      'lines', jsonb_build_array(
        jsonb_build_array(jsonb_build_object('text', 'نحن لا نضيف ضوضاء جديدة إلى السوق.')),
        jsonb_build_array(jsonb_build_object('text', 'نفهم ما يحدث،', 'tone', 'muted')),
        jsonb_build_array(
          jsonb_build_object('text', 'نحدّد أين تكمن ', 'tone', 'muted'),
          jsonb_build_object('text', 'الفرصة', 'highlight', true),
          jsonb_build_object('text', '،', 'tone', 'muted')
        ),
        jsonb_build_array(
          jsonb_build_object('text', 'ثم نبني '),
          jsonb_build_object('text', 'الاتجاه', 'highlight', true),
          jsonb_build_object('text', ' الذي يستحق أن تتحرك نحوه العلامة.')
        )
      )
    ),
    true,
    'Homepage scroll-pinned manifesto copy.'
  ),
  (
    'contact',
    jsonb_build_object(
      'headingBefore', 'عندك شيء يستحق أن ',
      'headingHighlight', 'يتحرك',
      'headingAfter', '؟',
      'ctaLabel', 'لنتحدث',
      'email', 'hello@sharks.agency'
    ),
    true,
    'Shared contact call to action.'
  ),
  (
    'studio',
    jsonb_build_object(
      'titleBefore', 'ننظر إلى المشروع كمنظومة ',
      'titleHighlight', 'متكاملة',
      'titleAfter', '.',
      'description', 'نبحث، نفهم، نحدّد الاتجاه، ثم نبني ما يحتاجه المشروع فعلًا.',
      'trackSummary', 'مسارات تعمل كمنظومة واحدة.'
    ),
    true,
    'Shared studio section copy.'
  ),
  (
    'default_seo',
    jsonb_build_object(
      'title', 'Sharks Agency — نصنع الاتجاه',
      'description', 'وكالة إبداعية عربية تبني الاستراتيجية والهوية والتسويق والتجارب الرقمية كمنظومة واحدة.',
      'ogTitle', 'Sharks Agency — نصنع الاتجاه',
      'ogDescription', 'استراتيجية، هوية، تسويق وتجارب رقمية تتحرك في اتجاه واحد.'
    ),
    true,
    'Default site metadata.'
  ),
  (
    'social_links',
    jsonb_build_array(
      jsonb_build_object('label', 'Email', 'value', 'hello@sharks.agency', 'href', 'mailto:hello@sharks.agency'),
      jsonb_build_object('label', 'Instagram', 'value', '@sharks.agency', 'href', 'https://www.instagram.com/sharks.agency/'),
      jsonb_build_object('label', 'LinkedIn', 'value', 'Sharks Agency', 'href', 'https://www.linkedin.com/company/sharks-agency/'),
      jsonb_build_object('label', 'Behance', 'value', 'sharksagency', 'href', 'https://www.behance.net/sharksagency')
    ),
    true,
    'Public social and contact links.'
  )
on conflict (key) do update set
  value = excluded.value,
  is_public = excluded.is_public,
  description = excluded.description;

insert into public.services (
  slug, number, title_ar, title_en, tags, description_ar, description_en,
  image_url, image_alt_ar, image_alt_en, sort_order, is_active
)
values
  (
    'strategy-and-growth', '01', 'الاستراتيجية والنمو', 'Strategy & Growth',
    array['Strategy', 'Research', 'Market Analysis', 'Brand Positioning', 'Growth'],
    'نبدأ بفهم السوق والجمهور والمنافسة، ثم نحدد المسار الذي يمكن للعلامة أن تتحرك فيه بوضوح.', null,
    'https://images.unsplash.com/photo-1546414701-81cc6963c67f?w=1200&h=1400&fit=crop&auto=format&q=80',
    'تكوينات معمارية خرسانية تجريدية', null, 1, true
  ),
  (
    'identity-and-creativity', '02', 'الهوية والإبداع', 'Identity & Creativity',
    array['Brand Strategy', 'Visual Identity', 'Logo Design', 'Guidelines', 'Creative Direction'],
    'نبني هوية يمكن تذكّرها، لا مجرد عناصر بصرية جميلة.', null,
    'https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=1200&h=1400&fit=crop&auto=format&q=80',
    'مصمم يرسم أفكارًا بصرية على جهاز لوحي', null, 2, true
  ),
  (
    'marketing-and-communication', '03', 'التسويق والتواصل', 'Marketing & Communication',
    array['Campaign Strategy', 'Social Media', 'Digital Marketing', 'Communication'],
    'نحوّل الاستراتيجية إلى حضور متّسق يصل إلى الجمهور الصحيح ويصنع أثرًا حقيقيًا.', null,
    'https://images.unsplash.com/photo-1572272622046-db9812816992?w=1200&h=1400&fit=crop&auto=format&q=80',
    'مسارات ضوئية طويلة تعبّر عن الحركة', null, 3, true
  ),
  (
    'content-and-digital-experiences', '04', 'المحتوى والتجارب الرقمية', 'Content & Digital Experiences',
    array['Content', 'Web Design', 'UI / UX', 'Motion', 'Creative Development'],
    'نصمم نقاط التواصل التي يعيش من خلالها الجمهور تجربة العلامة.', null,
    'https://images.unsplash.com/photo-1633259584604-afdc243122ea?w=1200&h=1400&fit=crop&auto=format&q=80',
    'ملمس أزرق تجريدي', null, 4, true
  )
on conflict (slug) do update set
  number = excluded.number,
  title_ar = excluded.title_ar,
  title_en = excluded.title_en,
  tags = excluded.tags,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  image_url = excluded.image_url,
  image_alt_ar = excluded.image_alt_ar,
  image_alt_en = excluded.image_alt_en,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.scenarios (
  slug, number, scenario_label, title_ar, title_en, focus, keywords,
  description_ar, description_en, cover_image_url, cover_alt_ar, cover_alt_en,
  intro_ar, intro_en, hero_keywords, situation_ar, what_we_look_for,
  possible_outputs, philosophy_ar, cta_ar, sort_order, is_published,
  is_featured, seo_title, seo_description, og_image_url
)
values
  (
    'from-idea-to-brand', '01', 'Scenario 01 — Capabilities in Action',
    'من فكرة إلى علامة', 'From Idea to Brand', 'Positioning · Identity · System',
    array['التموضع', 'الهوية', 'نظام العلامة'],
    'مشروع يبدأ من الصفر ويحتاج إلى تحديد موقعه، بناء هويته، وصناعة نظام واضح يمكن أن ينطلق منه بثقة.', null,
    'https://images.unsplash.com/photo-1625390711106-3728815ebcd9?w=1400&h=1000&fit=crop&auto=format&q=80',
    'تكوين بصري تجريدي لسيناريو بناء علامة من فكرة', null,
    'مشروع يبدأ من الصفر ويحتاج إلى تحديد موقعه، بناء هويته، وصناعة نظام واضح يمكن أن ينطلق منه.', null,
    array['Positioning', 'Strategy', 'Identity', 'System', 'Launch'],
    jsonb_build_object(
      'title', 'الموقف',
      'lead', 'الفكرة موجودة، لكن مكانها في السوق غير واضح بعد.',
      'body', 'الجمهور لم يُحدد بدقة، والهوية ما زالت مجرد تصورات متفرقة. هناك حماس كبير للانطلاق، لكن غياب الوضوح يجعل كل قرار لاحق أصعب مما يجب — من الاسم إلى الشكل إلى طريقة الحديث.'
    ),
    jsonb_build_object(
      'title', 'عن ماذا نبحث؟',
      'intro', 'قبل أن نصمم أي شيء، نطرح الأسئلة التي تحدد المسار.',
      'items', jsonb_build_array('السوق', 'الجمهور', 'المنافسة', 'الفرصة', 'الموقع', 'الشخصية', 'الاتجاه')
    ),
    jsonb_build_object(
      'title', 'ما الذي يمكن أن نخرج به؟',
      'note', 'لا يحتاج كل مشروع إلى الأدوات نفسها. نحدد ما يجب بناؤه بعد فهم المشكلة.',
      'items', jsonb_build_array('Brand Strategy', 'Positioning', 'Visual Identity', 'Brand Guidelines', 'Creative Direction', 'Launch Direction', 'Website', 'Social System')
    ),
    jsonb_build_object('before', E'لا نبدأ من قائمة خدمات.\nنبدأ من ', 'highlight', 'المشكلة', 'after', '.'),
    jsonb_build_object('question', 'مشروعك قريب من هذا السيناريو؟', 'action', 'خلينا نحدد اتجاهه.'),
    1, true, true, 'من فكرة إلى علامة',
    'كيف تبني Sharks Agency التموضع والاستراتيجية والهوية من فكرة جديدة.',
    'https://images.unsplash.com/photo-1625390711106-3728815ebcd9?w=1400&h=1000&fit=crop&auto=format&q=80'
  ),
  (
    'from-chaos-to-system', '02', 'Scenario 02 — Capabilities in Action',
    'من حضور مشتت إلى نظام', 'From Chaos to System', 'Rebrand · Content · Experience',
    array['إعادة العلامة', 'المحتوى', 'التجربة'],
    'علامة موجودة بالفعل لكن هويتها ومحتواها وتجربتها لا تعمل كمنظومة واحدة — فنعيد ترتيبها في نظام متّسق.', null,
    'https://images.unsplash.com/photo-1712265858498-4514ea90e20f?w=1600&h=900&fit=crop&auto=format&q=80',
    'تكوين بصري تجريدي لسيناريو تحويل الحضور المشتت إلى نظام', null,
    'علامة موجودة بالفعل لكن هويتها ومحتواها وتجربتها لا تعمل كمنظومة واحدة، فنعيد ترتيبها في نظام متّسق.', null,
    array['Audit', 'Rebrand', 'System', 'Content', 'Consistency'],
    jsonb_build_object(
      'title', 'الموقف',
      'lead', 'العلامة تعمل، لكنها تبدو مختلفة في كل مكان تظهر فيه.',
      'body', 'الشعار شيء، والموقع شيء آخر، والمحتوى يقوله شخص مختلف في كل مرة. لا يوجد خطأ واحد كبير، بل عشرات القرارات الصغيرة التي تراكمت بدون نظام يجمعها. النتيجة: حضور مشتت يُضعف الثقة بدل أن يبنيها.'
    ),
    jsonb_build_object(
      'title', 'عن ماذا نبحث؟',
      'intro', 'نقرأ ما هو موجود أولًا قبل أن نقترح ما يجب تغييره.',
      'items', jsonb_build_array('التناقضات', 'نقاط التواصل', 'الصوت', 'البنية', 'الفجوات', 'ما يستحق البقاء', 'الأولويات')
    ),
    jsonb_build_object(
      'title', 'ما الذي يمكن أن نخرج به؟',
      'note', 'لا يحتاج كل مشروع إلى الأدوات نفسها. نحدد ما يجب بناؤه بعد فهم المشكلة.',
      'items', jsonb_build_array('Brand Audit', 'Rebrand', 'Design System', 'Brand Guidelines', 'Content System', 'Voice & Tone', 'Templates', 'Rollout Plan')
    ),
    jsonb_build_object('before', E'لا نبدأ بإصلاح الشكل.\nنبدأ بإصلاح ', 'highlight', 'النظام', 'after', '.'),
    jsonb_build_object('question', 'مشروعك قريب من هذا السيناريو؟', 'action', 'خلينا نحدد اتجاهه.'),
    2, true, false, 'من حضور مشتت إلى نظام',
    'كيف تعيد Sharks Agency ترتيب حضور العلامة في نظام متسق.',
    'https://images.unsplash.com/photo-1712265858498-4514ea90e20f?w=1600&h=900&fit=crop&auto=format&q=80'
  ),
  (
    'from-product-to-experience', '03', 'Scenario 03 — Capabilities in Action',
    'من منتج إلى تجربة', 'From Product to Experience', 'Product · UX · Identity',
    array['المنتج', 'تجربة المستخدم', 'الهوية'],
    'منتج جيد يحتاج إلى تجربة رقمية أوضح وهوية تجعل قيمته أسهل في الفهم والاستخدام.', null,
    'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=1200&h=1500&fit=crop&auto=format&q=80',
    'تكوين بصري تجريدي لسيناريو تحويل المنتج إلى تجربة', null,
    'منتج جيد يحتاج إلى تجربة رقمية أوضح وهوية تجعل قيمته أسهل في الفهم والاستخدام.', null,
    array['Product', 'Experience', 'UX', 'Interface', 'Clarity'],
    jsonb_build_object(
      'title', 'الموقف',
      'lead', 'المنتج جيد، لكن قيمته لا تصل بالسرعة الكافية.',
      'body', 'المستخدم يحتاج إلى وقت أطول من اللازم ليفهم ماذا يفعل المنتج ولماذا يهمّه. الواجهة تعمل، لكنها لا تروي قصة واضحة، والهوية لا تساند التجربة. الفجوة ليست في المنتج نفسه، بل في الطريقة التي يُقدَّم بها.'
    ),
    jsonb_build_object(
      'title', 'عن ماذا نبحث؟',
      'intro', 'نبدأ من المستخدم والرحلة قبل أن نلمس البكسل.',
      'items', jsonb_build_array('المستخدم', 'الرحلة', 'الاحتكاك', 'القيمة', 'الوضوح', 'اللحظة الأولى', 'الثقة')
    ),
    jsonb_build_object(
      'title', 'ما الذي يمكن أن نخرج به؟',
      'note', 'لا يحتاج كل مشروع إلى الأدوات نفسها. نحدد ما يجب بناؤه بعد فهم المشكلة.',
      'items', jsonb_build_array('UX Strategy', 'User Flows', 'UI Design', 'Design System', 'Prototype', 'Visual Identity', 'Website', 'Product Direction')
    ),
    jsonb_build_object('before', E'لا نبدأ من الشاشات.\nنبدأ من ', 'highlight', 'التجربة', 'after', '.'),
    jsonb_build_object('question', 'مشروعك قريب من هذا السيناريو؟', 'action', 'خلينا نحدد اتجاهه.'),
    3, true, false, 'من منتج إلى تجربة',
    'كيف تحوّل Sharks Agency المنتج الجيد إلى تجربة واضحة ومتماسكة.',
    'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=1200&h=1500&fit=crop&auto=format&q=80'
  )
on conflict (slug) do update set
  number = excluded.number,
  scenario_label = excluded.scenario_label,
  title_ar = excluded.title_ar,
  title_en = excluded.title_en,
  focus = excluded.focus,
  keywords = excluded.keywords,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  cover_image_url = excluded.cover_image_url,
  cover_alt_ar = excluded.cover_alt_ar,
  cover_alt_en = excluded.cover_alt_en,
  intro_ar = excluded.intro_ar,
  intro_en = excluded.intro_en,
  hero_keywords = excluded.hero_keywords,
  situation_ar = excluded.situation_ar,
  what_we_look_for = excluded.what_we_look_for,
  possible_outputs = excluded.possible_outputs,
  philosophy_ar = excluded.philosophy_ar,
  cta_ar = excluded.cta_ar,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  og_image_url = excluded.og_image_url;

with step_seed(slug, step_number, title_ar, sort_order) as (
  values
    ('from-idea-to-brand', '01', 'نبحث', 1),
    ('from-idea-to-brand', '02', 'نحدد الموقع', 2),
    ('from-idea-to-brand', '03', 'نبني الاستراتيجية', 3),
    ('from-idea-to-brand', '04', 'نصمم الهوية', 4),
    ('from-idea-to-brand', '05', 'نجهّز الانطلاق', 5),
    ('from-chaos-to-system', '01', 'نراجع', 1),
    ('from-chaos-to-system', '02', 'نحدد الأساس', 2),
    ('from-chaos-to-system', '03', 'نعيد البناء', 3),
    ('from-chaos-to-system', '04', 'نوحّد النظام', 4),
    ('from-chaos-to-system', '05', 'نطبّق ونوثّق', 5),
    ('from-product-to-experience', '01', 'نفهم', 1),
    ('from-product-to-experience', '02', 'نرسم الرحلة', 2),
    ('from-product-to-experience', '03', 'نبسّط التجربة', 3),
    ('from-product-to-experience', '04', 'نصمم الواجهة', 4),
    ('from-product-to-experience', '05', 'نختبر ونحسّن', 5)
)
insert into public.scenario_steps (scenario_id, step_number, title_ar, sort_order)
select scenarios.id, step_seed.step_number, step_seed.title_ar, step_seed.sort_order
from step_seed
join public.scenarios on scenarios.slug = step_seed.slug
on conflict (scenario_id, sort_order) do update set
  step_number = excluded.step_number,
  title_ar = excluded.title_ar;

insert into public.blog_categories (slug, name_ar, name_en, sort_order, is_active)
values
  ('strategy', 'الاستراتيجية', 'Strategy', 1, true),
  ('identity', 'الهوية', 'Identity', 2, true),
  ('design', 'التصميم', 'Design', 3, true),
  ('marketing', 'التسويق', 'Marketing', 4, true),
  ('web', 'الويب', 'Web', 5, true),
  ('culture', 'الثقافة', 'Culture', 6, true),
  ('ai', 'الذكاء الاصطناعي', 'AI', 7, true)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

with post_seed as (
  select * from (values
    (
      'identity-does-not-start-with-logo', 'لماذا لا تبدأ الهوية من الشعار؟',
      'نظرة على القرارات التي تسبق التصميم، ولماذا تبدأ الهوية من فهم العلامة قبل رسمها.',
      'الشعار هو آخر ما نرسمه، لا أوله. الهوية تبدأ من سؤال أبسط وأصعب: ما الذي تعنيه هذه العلامة قبل أن تُرى؟',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&h=1100&fit=crop&auto=format&q=80',
      'غلاف تجريدي لمقال عن بناء الهوية', 'identity', 6, true,
      '2026-05-12T09:00:00Z'::timestamptz,
      array['market-needs-direction', 'beautiful-vs-clear']::text[],
      jsonb_build_object('type', 'doc', 'blocks', jsonb_build_array(
        jsonb_build_object('type', 'p', 'text', 'حين يطلب عميل «هوية جديدة»، يكون الشعار غالبًا أول ما يخطر في ذهنه. لكن الشعار مجرد ختمٍ يُوضع في النهاية على قرارٍ اتُّخذ قبله بوقت طويل. الهوية الحقيقية تسبق الشكل: إنها الموقف الذي تتبناه العلامة، والصوت الذي تتحدث به، والاتجاه الذي تسير فيه.'),
        jsonb_build_object('type', 'h2', 'text', 'الشكل نتيجة، لا نقطة بداية'),
        jsonb_build_object('type', 'p', 'text', 'عندما نبدأ من الشعار، نصمم غلافًا لكتابٍ لم يُكتب بعد. النتيجة شعار جميل ربما، لكنه معلّق في الفراغ — لا يستند إلى معنى، ولا يقاوم الزمن. أما حين نبدأ من فهم العلامة، فإن كل قرار بصري يصبح امتدادًا طبيعيًا لموقفٍ واضح.'),
        jsonb_build_object('type', 'quote', 'text', 'الهوية ليست شكلًا. إنها قرار.'),
        jsonb_build_object('type', 'p', 'text', 'قبل أن نرسم أي خط، نسأل: لمن نتحدث؟ وبماذا نختلف؟ وما الشعور الذي نريد أن نتركه؟ هذه الأسئلة لا تُجاب بالألوان، بل بالاستراتيجية. والتصميم الجيد لا يخترع هذه الإجابات، بل يجعلها مرئية.'),
        jsonb_build_object('type', 'h3', 'text', 'ما الذي يسبق الرسم؟'),
        jsonb_build_object('type', 'list', 'items', jsonb_build_array(
          'فهم واضح للسوق والمنافسة وموقع العلامة داخلها.',
          'تعريف دقيق للجمهور: من يهمّنا، ومن لا يهمّنا.',
          'صوتٌ ونبرة يمكن الالتزام بهما عبر كل نقطة تواصل.',
          'قرار حول ما تريد العلامة أن تُعرف به — وما ترفض أن تكونه.'
        )),
        jsonb_build_object(
          'type', 'image',
          'src', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1800&h=1100&fit=crop&auto=format&q=80',
          'caption', 'الهوية نظام متكامل، لا رمز منفرد.',
          'break', true
        ),
        jsonb_build_object('type', 'highlight', 'text', 'الشعار الذي يبدأ من معنى واضح يصمد. الشعار الذي يبدأ من الذوق وحده يتقادم.'),
        jsonb_build_object('type', 'p', 'text', 'حين نصل أخيرًا إلى الشعار، لا يكون خيارًا عشوائيًا بين مقترحات، بل خلاصةً حتمية لكل ما سبقه. عندها فقط يصبح الشعار قويًا — لأنه يحمل قرارًا، لا مجرد شكل.')
      ))
    ),
    (
      'market-needs-direction', 'السوق لا يحتاج صوتًا أعلى. يحتاج اتجاهًا أوضح.',
      'في سوقٍ يصرخ فيه الجميع، لا يفوز من يرفع صوته، بل من يعرف إلى أين يتجه ولماذا.',
      'الضجيج ليس استراتيجية. العلامات التي تبقى ليست الأعلى صوتًا، بل الأوضح اتجاهًا.',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1800&h=1100&fit=crop&auto=format&q=80',
      'غلاف تجريدي لمقال عن وضوح اتجاه العلامة', 'strategy', 5, false,
      '2026-04-28T09:00:00Z'::timestamptz,
      array['identity-does-not-start-with-logo', 'design-as-growth-tool']::text[],
      jsonb_build_object('type', 'doc', 'blocks', jsonb_build_array(
        jsonb_build_object('type', 'p', 'text', 'حين يشتد التنافس، يكون رد الفعل الأول عادةً هو رفع الصوت: مزيد من الإعلانات، مزيد من المحتوى، مزيد من الحضور. لكن السوق لا يعاني من نقص الأصوات، بل من فائضها. ما يندر فعلًا هو الوضوح.'),
        jsonb_build_object('type', 'h2', 'text', 'لماذا يفشل الصوت الأعلى؟'),
        jsonb_build_object('type', 'p', 'text', 'الصوت الأعلى يلفت الانتباه لحظة، ثم يذوب في الضجيج العام. أما الاتجاه الواضح فيبني ذاكرة. حين يعرف الناس ما تمثّله علامتك، لا يحتاجون إلى تذكيرٍ دائم بوجودها.'),
        jsonb_build_object('type', 'quote', 'text', 'لا ننتظر الموجة. نحدّد اتجاهها.'),
        jsonb_build_object('type', 'highlight', 'text', 'الوضوح يوفّر عليك ميزانية الصراخ. حين يعرف الناس اتجاهك، يتذكرونك دون أن تلاحقهم.'),
        jsonb_build_object('type', 'p', 'text', 'الاتجاه الواضح قرار صعب لأنه يعني الاختيار: أن تقول لا لجماهير، ولأسواق، ولفرصٍ لامعة لكنها خارج المسار. غير أن هذا الرفض نفسه هو ما يمنح العلامة حدّتها.')
      ))
    ),
    (
      'when-simplicity-is-bad', 'متى تصبح البساطة قرارًا سيئًا؟',
      'البساطة ليست هدفًا في ذاتها. أحيانًا يكون التبسيط المفرط مجرد تهرّب من التعقيد الضروري.',
      'نحب أن نمدح البساطة، لكن ليست كل بساطة فضيلة. بعضها حذفٌ لأشياء كان يجب أن تبقى.',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1800&h=1100&fit=crop&auto=format&q=80',
      'غلاف تجريدي لمقال عن البساطة في التصميم', 'design', 4, false,
      '2026-04-10T09:00:00Z'::timestamptz,
      array['same-websites', 'design-as-growth-tool']::text[],
      jsonb_build_object('type', 'doc', 'blocks', jsonb_build_array(
        jsonb_build_object('type', 'p', 'text', 'صارت «البساطة» كلمة سحرية في التصميم. لكن حين تتحول إلى شعارٍ نُطبّقه دون تفكير، تصبح غطاءً للكسل: نحذف التفاصيل لأنها صعبة، لا لأنها زائدة.'),
        jsonb_build_object('type', 'quote', 'text', 'البساطة الجيدة توضيح. البساطة السيئة حذف.'),
        jsonb_build_object('type', 'p', 'text', 'الفرق بينهما دقيق: البساطة الحقيقية تزيل ما يشوّش على المعنى، أما التبسيط المفرط فيزيل المعنى نفسه. الأولى تتطلب فهمًا عميقًا، والثانية تتهرّب منه.'),
        jsonb_build_object('type', 'highlight', 'text', 'اسأل دائمًا: هل أزلت التعقيد، أم أخفيته على حساب المستخدم؟')
      ))
    ),
    (
      'ai-and-creativity', 'هل الذكاء الاصطناعي يقتل الإبداع أم يكشفه؟',
      'الأدوات الجديدة لا تلغي الإبداع، لكنها تكشف بسرعة من يملك اتجاهًا ومن يملك تقنية فقط.',
      'الذكاء الاصطناعي لا يهدد المبدعين. يهدد من كان يختبئ خلف المهارة التنفيذية وحدها.',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1800&h=1100&fit=crop&auto=format&q=80',
      'غلاف تجريدي لمقال عن الذكاء الاصطناعي والإبداع', 'ai', 7, false,
      '2026-03-22T09:00:00Z'::timestamptz,
      array['when-simplicity-is-bad', 'market-needs-direction']::text[],
      jsonb_build_object('type', 'doc', 'blocks', jsonb_build_array(
        jsonb_build_object('type', 'p', 'text', 'كلما ظهرت أداة جديدة، عاد السؤال نفسه: هل ستقتل الإبداع؟ لكن الأدوات لا تصنع الاتجاه، بل تنفّذه بسرعة أكبر. والذكاء الاصطناعي، مثل كل أداة قوية، يضخّم ما لديك — لا يخلقه من عدم.'),
        jsonb_build_object('type', 'h2', 'text', 'ما الذي يكشفه؟'),
        jsonb_build_object('type', 'p', 'text', 'حين يصبح التنفيذ رخيصًا وسريعًا، تفقد المهارة التقنية وحدها قيمتها التنافسية. ويبقى السؤال الأصعب: ماذا تريد أن تقول؟ ولماذا؟ هنا يظهر الفرق بين من يملك رؤية ومن يجيد التنفيذ فقط.'),
        jsonb_build_object('type', 'quote', 'text', 'الأداة تسرّع الطريق. لكنها لا تختار الوجهة.'),
        jsonb_build_object('type', 'highlight', 'text', 'الذكاء الاصطناعي لا يعوّض غياب الفكرة. إنه يجعل غيابها أكثر وضوحًا.'),
        jsonb_build_object('type', 'p', 'text', 'المبدع الذي يعرف اتجاهه سيستخدم هذه الأدوات ليذهب أبعد. أما من لا يملك اتجاهًا، فسيصنع بها المزيد من اللاشيء — أسرع.')
      ))
    ),
    (
      'same-websites', 'لماذا تبدو معظم مواقع الشركات متشابهة؟',
      'حين تبدأ كل الشركات من القوالب نفسها والخوف نفسه، تنتهي إلى الشكل نفسه.',
      'التشابه ليس صدفة. إنه نتيجة حتمية للبدء من المرجع نفسه، والخوف من الخروج عنه.',
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1800&h=1100&fit=crop&auto=format&q=80',
      'غلاف تجريدي لمقال عن تشابه مواقع الشركات', 'web', 5, false,
      '2026-03-05T09:00:00Z'::timestamptz,
      array['identity-does-not-start-with-logo', 'when-simplicity-is-bad']::text[],
      jsonb_build_object('type', 'doc', 'blocks', jsonb_build_array(
        jsonb_build_object('type', 'p', 'text', 'افتح عشرة مواقع لشركاتٍ في المجال نفسه، وستجد الترتيب نفسه تقريبًا: عنوان كبير، زر، ثلاث بطاقات، شهادات عملاء، تذييل. ليس لأن هذا هو الأفضل، بل لأنه الأكثر أمانًا.'),
        jsonb_build_object('type', 'h2', 'text', 'التشابه قرار، لا قدر'),
        jsonb_build_object('type', 'p', 'text', 'حين ينسخ الجميع القالب نفسه خوفًا من المخاطرة، يصبح التميّز نفسه مخاطرة. لكن الموقع الذي يشبه كل شيء لا يُتذكر بأي شيء.'),
        jsonb_build_object('type', 'highlight', 'text', 'إذا كان تصميمك يمكن أن ينتمي لأي شركة، فهو لا ينتمي لك.'),
        jsonb_build_object('type', 'p', 'text', 'الخروج من التشابه لا يعني الغرابة، بل الوضوح: أن يعكس الموقع اتجاه العلامة الحقيقي، لا القالب الأكثر شيوعًا.')
      ))
    ),
    (
      'beautiful-vs-clear', 'الفرق بين أن تكون العلامة جميلة وأن تكون واضحة.',
      'الجمال يجذب النظرة الأولى. الوضوح هو ما يجعل الناس يعودون ويثقون.',
      'كثير من العلامات جميلة ولا أحد يفهمها. الجمال بلا وضوح زينة، لا هوية.',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1800&h=1100&fit=crop&auto=format&q=80',
      'غلاف تجريدي لمقال عن الجمال والوضوح', 'identity', 4, false,
      '2026-02-18T09:00:00Z'::timestamptz,
      array['identity-does-not-start-with-logo', 'market-needs-direction']::text[],
      jsonb_build_object('type', 'doc', 'blocks', jsonb_build_array(
        jsonb_build_object('type', 'p', 'text', 'من السهل أن تصنع شيئًا جميلًا. الأصعب أن تصنع شيئًا واضحًا. الجمال يلفت الانتباه، لكن الوضوح هو ما يبني الفهم والثقة على المدى الطويل.'),
        jsonb_build_object('type', 'quote', 'text', 'الجميل يُعجب. الواضح يُفهم — ويُتذكر.'),
        jsonb_build_object('type', 'p', 'text', 'حين تتعارض الاثنتان، نختار الوضوح. لأن علامة يفهمها الناس بسرعة أقوى من علامة يعجبون بها ثم ينسونها.'),
        jsonb_build_object('type', 'highlight', 'text', 'الوضوح ليس عدو الجمال. إنه ما يمنحه معنى.')
      ))
    ),
    (
      'design-as-growth-tool', 'كيف يتحول التصميم من شكل إلى أداة نمو؟',
      'التصميم الذي لا يخدم قرارًا تجاريًا يبقى ديكورًا. النمو يبدأ حين يصبح التصميم أداة.',
      'حين يرتبط التصميم بأهداف واضحة، يتحول من مصاريف إلى استثمار — ومن شكل إلى أثر.',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&h=1100&fit=crop&auto=format&q=80',
      'غلاف تجريدي لمقال عن التصميم كأداة نمو', 'design', 6, false,
      '2026-02-01T09:00:00Z'::timestamptz,
      array['market-needs-direction', 'beautiful-vs-clear']::text[],
      jsonb_build_object('type', 'doc', 'blocks', jsonb_build_array(
        jsonb_build_object('type', 'p', 'text', 'يُعامَل التصميم أحيانًا كطبقة تجميلية تُضاف في النهاية. لكن التصميم الأقوى يبدأ مبكرًا، ويُتخذ كقرارٍ تجاري: كيف نجعل المنتج أوضح، والقرار أسهل، والثقة أسرع؟'),
        jsonb_build_object('type', 'h2', 'text', 'من الشكل إلى الأثر'),
        jsonb_build_object('type', 'p', 'text', 'حين نربط كل قرار تصميمي بهدف — تحويل، احتفاظ، وضوح، ثقة — يتوقف التصميم عن كونه مسألة ذوق، ويصبح رافعة نمو قابلة للقياس.'),
        jsonb_build_object('type', 'quote', 'text', 'التصميم الجيد لا يُرى فقط. يُحدث فرقًا يمكن قياسه.'),
        jsonb_build_object('type', 'highlight', 'text', 'اسأل عن كل عنصر: ما القرار الذي يسهّله على المستخدم؟ إن لم تكن هناك إجابة، فهو زينة.')
      ))
    )
  ) as seeded(
    slug, title, excerpt, deck, cover_path, cover_alt, category_slug,
    reading_minutes, featured, published_at, related_slugs, content
  )
)
insert into public.blog_posts (
  slug, title_ar, excerpt_ar, deck_ar, cover_image_url, cover_alt_ar,
  category_id, author_name, status, is_featured, published_at, reading_time,
  content, related_slugs, seo_title, seo_description, og_image_url
)
select
  post_seed.slug,
  post_seed.title,
  post_seed.excerpt,
  post_seed.deck,
  post_seed.cover_path,
  post_seed.cover_alt,
  blog_categories.id,
  'Sharks Studio',
  'published',
  post_seed.featured,
  post_seed.published_at,
  post_seed.reading_minutes,
  post_seed.content,
  post_seed.related_slugs,
  post_seed.title,
  post_seed.excerpt,
  post_seed.cover_path
from post_seed
join public.blog_categories on blog_categories.slug = post_seed.category_slug
on conflict (slug) do update set
  title_ar = excluded.title_ar,
  excerpt_ar = excluded.excerpt_ar,
  deck_ar = excluded.deck_ar,
  cover_image_url = excluded.cover_image_url,
  cover_alt_ar = excluded.cover_alt_ar,
  category_id = excluded.category_id,
  author_name = excluded.author_name,
  status = excluded.status,
  is_featured = excluded.is_featured,
  published_at = excluded.published_at,
  reading_time = excluded.reading_time,
  content = excluded.content,
  related_slugs = excluded.related_slugs,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  og_image_url = excluded.og_image_url;
