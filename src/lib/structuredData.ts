import { resume } from "@/lib/resume";

export const SITE_URL = "https://vkchang39.github.io/amisha-portfolio-SA";

/** schema.org Person — helps search engines surface name/title/links correctly. */
export const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: resume.name,
  jobTitle: resume.title,
  description: resume.summary,
  url: `${SITE_URL}/`,
  email: `mailto:${resume.email}`,
  telephone: resume.phone,
  image: `${SITE_URL}/images/og-share.jpg`,
  sameAs: [resume.linkedinUrl],
  knowsAbout: resume.competencies,
  worksFor: {
    "@type": "Organization",
    name: resume.experience[0]?.company,
  },
  alumniOf: resume.education.map((edu) => ({
    "@type": "EducationalOrganization",
    name: edu.school,
  })),
} as const;
