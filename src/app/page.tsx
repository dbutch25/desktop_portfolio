import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { Desktop } from "@/components/desktop/desktop";

// Static, refreshed by revalidatePath("/") whenever the CMS saves.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteContent();
  const title = `${profile.name} — ${profile.title}`;
  return {
    title: { absolute: title },
    description: profile.heroBody,
    openGraph: { title, description: profile.heroBody, images: [profile.portraitUrl], type: "profile" },
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const content = await getSiteContent();
  const { profile } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    url: profile.siteUrl ?? undefined,
    sameAs: [profile.linkedinUrl, profile.githubUrl].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {/* Crawlable summary; the desktop itself renders client-side. */}
      <div className="sr-only">
        <h1>
          {profile.name} — {profile.title}, {profile.location}
        </h1>
        <p>{profile.heroBody}</p>
        <ul>
          {content.projects
            .filter((p) => !p.draft)
            .map((p) => (
              <li key={p.id}>
                {p.title}: {p.summary}
              </li>
            ))}
        </ul>
      </div>
      <Desktop content={content} />
    </>
  );
}
