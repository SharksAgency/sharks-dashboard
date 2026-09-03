import { EntityPage } from "@/features/entities/entity-page"
export default function ContactPage() { return <EntityPage entity="site_settings" keys={["site_identity", "contact"]} overrideTitle={{ ar: "معلومات التواصل", en: "Contact Information" }} /> }
