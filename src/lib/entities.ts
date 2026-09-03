import type { IconName } from "@/components/ui/icon"

export type FieldType = "text" | "textarea" | "number" | "boolean" | "array" | "json" | "select" | "url" | "datetime"

export type EntityField = {
  key: string
  labelAr: string
  labelEn: string
  type: FieldType
  required?: boolean
  readonly?: boolean
  dir?: "rtl" | "ltr"
  options?: { value: string; labelAr: string; labelEn: string }[]
  placeholder?: string
  wide?: boolean
  defaultValue?: unknown
}

export type EntityName =
  | "services"
  | "scenarios"
  | "scenario_steps"
  | "blog_categories"
  | "projects"
  | "project_gallery"
  | "partners"
  | "team_members"
  | "site_settings"

export type EntityConfig = {
  name: EntityName
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  icon: IconName
  singularAr: string
  singularEn: string
  idField?: string
  orderBy: string
  orderAscending?: boolean
  searchKeys: string[]
  columns: string[]
  fields: EntityField[]
  allowCreate?: boolean
  allowDelete?: boolean
  detailsHref?: string
  detailsLabelAr?: string
  detailsLabelEn?: string
}

const text = (key: string, labelAr: string, labelEn: string, extra: Partial<EntityField> = {}): EntityField => ({ key, labelAr, labelEn, type: "text", ...extra })
const area = (key: string, labelAr: string, labelEn: string, extra: Partial<EntityField> = {}): EntityField => ({ key, labelAr, labelEn, type: "textarea", wide: true, ...extra })
const toggle = (key: string, labelAr: string, labelEn: string, defaultValue = false): EntityField => ({ key, labelAr, labelEn, type: "boolean", defaultValue })

export const entityConfigs: Record<EntityName, EntityConfig> = {
  services: {
    name: "services", titleAr: "الخدمات", titleEn: "Services", singularAr: "خدمة", singularEn: "Service", icon: "services", orderBy: "sort_order",
    descriptionAr: "إدارة الخدمات التي تظهر مباشرة على الموقع العام.", descriptionEn: "Manage the services rendered on the public website.", searchKeys: ["title_ar", "title_en", "slug", "number"], columns: ["number", "title_ar", "is_active", "sort_order", "updated_at"],
    fields: [
      text("slug", "الرابط المختصر", "Slug", { required: true, dir: "ltr", placeholder: "brand-strategy" }),
      text("number", "الرقم", "Number", { required: true, dir: "ltr", placeholder: "01" }),
      text("title_ar", "العنوان العربي", "Arabic title", { required: true, dir: "rtl" }),
      text("title_en", "العنوان الإنجليزي", "English title", { dir: "ltr" }),
      area("description_ar", "الوصف العربي", "Arabic description", { required: true, dir: "rtl" }),
      area("description_en", "الوصف الإنجليزي", "English description", { dir: "ltr" }),
      { key: "tags", labelAr: "الوسوم", labelEn: "Tags", type: "array", wide: true, placeholder: "Strategy, Brand, Digital" },
      text("image_url", "مسار الصورة", "Image path", { required: true, dir: "ltr", wide: true, placeholder: "services/image.jpg" }),
      text("image_alt_ar", "وصف الصورة العربي", "Arabic image alt", { required: true, dir: "rtl" }),
      text("image_alt_en", "وصف الصورة الإنجليزي", "English image alt", { dir: "ltr" }),
      { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 },
      toggle("is_active", "نشطة", "Active"),
    ],
  },
  scenarios: {
    name: "scenarios", titleAr: "السيناريوهات", titleEn: "Scenarios", singularAr: "سيناريو", singularEn: "Scenario", icon: "scenarios", orderBy: "sort_order",
    descriptionAr: "إدارة سيناريوهات القدرات وخطوات كل سيناريو.", descriptionEn: "Manage capability scenarios and their steps.", searchKeys: ["title_ar", "title_en", "slug", "number"], columns: ["number", "title_ar", "is_published", "is_featured", "sort_order", "updated_at"], detailsHref: "/scenarios/{id}/steps", detailsLabelAr: "الخطوات", detailsLabelEn: "Steps",
    fields: [
      text("slug", "الرابط المختصر", "Slug", { required: true, dir: "ltr" }), text("number", "الرقم", "Number", { required: true, dir: "ltr" }),
      text("scenario_label", "وسم السيناريو", "Scenario label", { required: true }), text("focus", "المحور", "Focus", { required: true }),
      text("title_ar", "العنوان العربي", "Arabic title", { required: true, dir: "rtl" }), text("title_en", "العنوان الإنجليزي", "English title", { dir: "ltr" }),
      area("description_ar", "الوصف العربي", "Arabic description", { required: true, dir: "rtl" }), area("description_en", "الوصف الإنجليزي", "English description", { dir: "ltr" }),
      area("intro_ar", "المقدمة العربية", "Arabic intro", { required: true, dir: "rtl" }), area("intro_en", "المقدمة الإنجليزية", "English intro", { dir: "ltr" }),
      { key: "keywords", labelAr: "الكلمات المفتاحية", labelEn: "Keywords", type: "array", wide: true }, { key: "hero_keywords", labelAr: "كلمات الواجهة", labelEn: "Hero keywords", type: "array", wide: true },
      text("cover_image_url", "مسار صورة الغلاف", "Cover image path", { required: true, dir: "ltr", wide: true }),
      text("cover_alt_ar", "وصف الغلاف العربي", "Arabic cover alt", { required: true }), text("cover_alt_en", "وصف الغلاف الإنجليزي", "English cover alt", { dir: "ltr" }),
      { key: "situation_ar", labelAr: "الموقف (JSON)", labelEn: "Situation (JSON)", type: "json", required: true, wide: true, dir: "rtl", defaultValue: {} },
      { key: "situation_en", labelAr: "الموقف الإنجليزي (JSON)", labelEn: "English situation (JSON)", type: "json", wide: true, dir: "ltr", defaultValue: {} },
      { key: "what_we_look_for", labelAr: "ما الذي نبحث عنه (JSON)", labelEn: "What we look for (JSON)", type: "json", required: true, wide: true, defaultValue: {} },
      { key: "what_we_look_for_en", labelAr: "ما الذي نبحث عنه بالإنجليزية (JSON)", labelEn: "English: what we look for (JSON)", type: "json", wide: true, dir: "ltr", defaultValue: {} },
      { key: "possible_outputs", labelAr: "المخرجات المحتملة (JSON)", labelEn: "Possible outputs (JSON)", type: "json", required: true, wide: true, defaultValue: {} },
      { key: "possible_outputs_en", labelAr: "المخرجات الإنجليزية (JSON)", labelEn: "English outputs (JSON)", type: "json", wide: true, dir: "ltr", defaultValue: {} },
      { key: "philosophy_ar", labelAr: "الفلسفة (JSON)", labelEn: "Philosophy (JSON)", type: "json", wide: true, defaultValue: {} },
      { key: "philosophy_en", labelAr: "الفلسفة الإنجليزية (JSON)", labelEn: "English philosophy (JSON)", type: "json", wide: true, dir: "ltr", defaultValue: {} },
      { key: "cta_ar", labelAr: "الدعوة للإجراء (JSON)", labelEn: "CTA (JSON)", type: "json", wide: true, defaultValue: {} },
      { key: "cta_en", labelAr: "الدعوة الإنجليزية (JSON)", labelEn: "English CTA (JSON)", type: "json", wide: true, dir: "ltr", defaultValue: {} },
      text("seo_title", "عنوان SEO", "SEO title", { wide: true }), area("seo_description", "وصف SEO", "SEO description"),
      text("og_image_url", "صورة المشاركة", "OG image path", { dir: "ltr", wide: true }),
      { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 }, toggle("is_published", "منشور", "Published"), toggle("is_featured", "مميز", "Featured"),
    ],
  },
  scenario_steps: {
    name: "scenario_steps", titleAr: "خطوات السيناريو", titleEn: "Scenario Steps", singularAr: "خطوة", singularEn: "Step", icon: "scenarios", orderBy: "sort_order",
    descriptionAr: "أضف الخطوات وعدّل ترتيبها.", descriptionEn: "Add steps and control their order.", searchKeys: ["title_ar", "title_en", "step_number"], columns: ["step_number", "title_ar", "sort_order", "created_at"],
    fields: [text("step_number", "رقم الخطوة", "Step number", { required: true, dir: "ltr" }), text("title_ar", "العنوان العربي", "Arabic title", { required: true, dir: "rtl" }), text("title_en", "العنوان الإنجليزي", "English title", { dir: "ltr" }), area("description_ar", "الوصف العربي", "Arabic description", { dir: "rtl" }), area("description_en", "الوصف الإنجليزي", "English description", { dir: "ltr" }), { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 }],
  },
  blog_categories: {
    name: "blog_categories", titleAr: "تصنيفات المدونة", titleEn: "Blog Categories", singularAr: "تصنيف", singularEn: "Category", icon: "blog", orderBy: "sort_order",
    descriptionAr: "التصنيفات المستخدمة لتنظيم المقالات.", descriptionEn: "Categories used to organize journal posts.", searchKeys: ["name_ar", "name_en", "slug"], columns: ["name_ar", "name_en", "is_active", "sort_order", "updated_at"],
    fields: [text("slug", "الرابط المختصر", "Slug", { required: true, dir: "ltr" }), text("name_ar", "الاسم العربي", "Arabic name", { required: true, dir: "rtl" }), text("name_en", "الاسم الإنجليزي", "English name", { required: true, dir: "ltr" }), { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 }, toggle("is_active", "نشط", "Active", true)],
  },
  projects: {
    name: "projects", titleAr: "المشاريع", titleEn: "Projects", singularAr: "مشروع", singularEn: "Project", icon: "projects", orderBy: "sort_order",
    descriptionAr: "أضف أعمالًا حقيقية فقط عندما تصبح جاهزة للنشر.", descriptionEn: "Add verified work only when it is ready to publish.", searchKeys: ["title_ar", "title_en", "client_name", "slug", "category"], columns: ["title_ar", "client_name", "category", "year", "is_published", "is_featured", "updated_at"], detailsHref: "/projects/{id}/gallery", detailsLabelAr: "المعرض", detailsLabelEn: "Gallery",
    fields: [
      text("slug", "الرابط المختصر", "Slug", { required: true, dir: "ltr" }), text("title_ar", "العنوان العربي", "Arabic title", { required: true, dir: "rtl" }), text("title_en", "العنوان الإنجليزي", "English title", { dir: "ltr" }),
      text("client_name", "اسم العميل", "Client name"), { key: "year", labelAr: "السنة", labelEn: "Year", type: "number" }, text("category", "التصنيف", "Category"), { key: "services", labelAr: "الخدمات", labelEn: "Services", type: "array", wide: true },
      area("short_description_ar", "الوصف القصير العربي", "Arabic short description", { required: true, dir: "rtl" }), area("short_description_en", "الوصف القصير الإنجليزي", "English short description", { dir: "ltr" }),
      area("challenge_ar", "التحدي العربي", "Arabic challenge", { dir: "rtl" }), area("challenge_en", "التحدي الإنجليزي", "English challenge", { dir: "ltr" }),
      area("approach_ar", "النهج العربي", "Arabic approach", { dir: "rtl" }), area("approach_en", "النهج الإنجليزي", "English approach", { dir: "ltr" }),
      area("execution_ar", "التنفيذ العربي", "Arabic execution", { dir: "rtl" }), area("execution_en", "التنفيذ الإنجليزي", "English execution", { dir: "ltr" }),
      area("result_ar", "النتيجة العربية", "Arabic result", { dir: "rtl" }), area("result_en", "النتيجة الإنجليزية", "English result", { dir: "ltr" }),
      text("cover_image_url", "صورة الغلاف", "Cover image", { required: true, dir: "ltr", wide: true }), text("thumbnail_image_url", "الصورة المصغرة", "Thumbnail", { dir: "ltr", wide: true }),
      text("cover_alt_ar", "وصف الغلاف العربي", "Arabic cover alt", { required: true }), text("cover_alt_en", "وصف الغلاف الإنجليزي", "English cover alt", { dir: "ltr" }),
      text("seo_title", "عنوان SEO", "SEO title", { wide: true }), area("seo_description", "وصف SEO", "SEO description"),
      { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 }, toggle("is_published", "منشور", "Published"), toggle("is_featured", "مميز", "Featured"),
    ],
  },
  project_gallery: {
    name: "project_gallery", titleAr: "معرض المشروع", titleEn: "Project Gallery", singularAr: "صورة", singularEn: "Image", icon: "media", orderBy: "sort_order",
    descriptionAr: "صور المشروع وعناوينها البديلة بالترتيب.", descriptionEn: "Project imagery, captions and accessible alt text.", searchKeys: ["image_url", "caption_ar", "alt_text_ar"], columns: ["image_url", "caption_ar", "sort_order", "created_at"],
    fields: [text("image_url", "مسار الصورة", "Image path", { required: true, dir: "ltr", wide: true }), text("alt_text_ar", "النص البديل العربي", "Arabic alt text", { required: true, dir: "rtl" }), text("alt_text_en", "النص البديل الإنجليزي", "English alt text", { dir: "ltr" }), area("caption_ar", "التعليق العربي", "Arabic caption", { dir: "rtl" }), area("caption_en", "التعليق الإنجليزي", "English caption", { dir: "ltr" }), { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 }],
  },
  partners: {
    name: "partners", titleAr: "الشركاء والعملاء", titleEn: "Partners & Clients", singularAr: "جهة", singularEn: "Organization", icon: "partners", orderBy: "sort_order",
    descriptionAr: "جهات حقيقية فقط؛ تبقى القائمة فارغة حتى إضافة بيانات موثّقة.", descriptionEn: "Verified organizations only; zero is a valid state.", searchKeys: ["name", "slug", "type"], columns: ["name", "type", "is_active", "is_featured", "sort_order", "updated_at"],
    fields: [text("name", "الاسم", "Name", { required: true }), text("slug", "الرابط المختصر", "Slug", { required: true, dir: "ltr" }), { key: "type", labelAr: "النوع", labelEn: "Type", type: "select", required: true, defaultValue: "partner", options: [{ value: "client", labelAr: "عميل", labelEn: "Client" }, { value: "partner", labelAr: "شريك", labelEn: "Partner" }, { value: "collaborator", labelAr: "متعاون", labelEn: "Collaborator" }] }, text("logo_url", "مسار الشعار", "Logo path", { dir: "ltr", wide: true }), { key: "website_url", labelAr: "الموقع", labelEn: "Website", type: "url", dir: "ltr", wide: true }, { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 }, toggle("is_active", "نشط", "Active"), toggle("is_featured", "مميز", "Featured")],
  },
  team_members: {
    name: "team_members", titleAr: "الفريق", titleEn: "Team", singularAr: "عضو فريق", singularEn: "Team member", icon: "team", orderBy: "sort_order",
    descriptionAr: "أعضاء الفريق وأدوارهم وروابطهم، دون مسميات ثابتة.", descriptionEn: "Team members, free-form roles, bios and social links.", searchKeys: ["name", "role_ar", "role_en"], columns: ["name", "role_ar", "role_en", "is_active", "sort_order", "updated_at"],
    fields: [text("name", "الاسم", "Name", { required: true }), text("role_ar", "الدور العربي", "Arabic role", { required: true, dir: "rtl" }), text("role_en", "الدور الإنجليزي", "English role", { dir: "ltr" }), area("bio_ar", "النبذة العربية", "Arabic bio", { dir: "rtl" }), area("bio_en", "النبذة الإنجليزية", "English bio", { dir: "ltr" }), text("photo_url", "مسار الصورة", "Photo path", { dir: "ltr", wide: true }), { key: "social_links", labelAr: "روابط التواصل (JSON)", labelEn: "Social links (JSON)", type: "json", wide: true, defaultValue: [] }, { key: "sort_order", labelAr: "الترتيب", labelEn: "Sort order", type: "number", defaultValue: 0 }, toggle("is_active", "نشط", "Active")],
  },
  site_settings: {
    name: "site_settings", titleAr: "محتوى الموقع", titleEn: "Website Content", singularAr: "إعداد محتوى", singularEn: "Content setting", icon: "content", idField: "key", orderBy: "key",
    descriptionAr: "النصوص والإعدادات العامة التي يستهلكها الموقع مباشرة.", descriptionEn: "Global content documents consumed directly by the public site.", searchKeys: ["key", "description"], columns: ["key", "description", "is_public", "updated_at"], allowCreate: false, allowDelete: false,
    fields: [text("key", "المفتاح", "Key", { readonly: true, dir: "ltr", wide: true }), { key: "value", labelAr: "المحتوى المنظّم (JSON)", labelEn: "Structured content (JSON)", type: "json", required: true, wide: true, defaultValue: {} }, area("description", "الوصف الداخلي", "Internal description"), toggle("is_public", "عام", "Public", true)],
  },
}

export function getEntityConfig(entity: EntityName) {
  return entityConfigs[entity]
}
