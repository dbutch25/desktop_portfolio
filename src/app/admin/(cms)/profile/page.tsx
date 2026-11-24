import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { RecordForm, type FieldDef } from "@/components/admin/record-form";
import { saveProfile } from "@/actions/admin";
import { getSiteContent } from "@/lib/content";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Name", span: 3 },
  { name: "title", label: "Title", span: 3, hint: "Shown as “Title · Location”." },
  { name: "location", label: "Location", span: 3 },
  { name: "coordinates", label: "Coordinates kicker", span: 3 },
  { name: "tagline", label: "Tagline (italic, under the name)", span: 6 },
  { name: "heroBody", label: "Desktop intro", type: "textarea", rows: 3 },
  { name: "aboutSubtitle", label: "readme.txt subtitle" },
  { name: "aboutBody", label: "readme.txt body", type: "textarea", rows: 8, hint: "Separate paragraphs with a blank line." },
  { name: "skillsIntro", label: "tech-stack.doc intro", type: "textarea", rows: 2 },
  { name: "email", label: "Email", type: "email", span: 3 },
  { name: "phone", label: "Phone", span: 3 },
  { name: "siteUrl", label: "Website", type: "url", span: 3 },
  { name: "linkedinUrl", label: "LinkedIn URL", type: "url", span: 3 },
  { name: "githubUrl", label: "GitHub URL", type: "url", span: 3 },
  { name: "githubUsername", label: "GitHub username", span: 3, hint: "Drives the contributions graph." },
  { name: "portraitUrl", label: "Portrait (2:3 works best)", type: "image" },
  { name: "logoUrl", label: "Logo (square)", type: "image" },
  { name: "resumeUrl", label: "Résumé PDF", type: "pdf", span: 4 },
  { name: "resumePages", label: "Résumé pages", type: "number", span: 2 },
  { name: "bootMessages", label: "Boot messages", type: "textarea", rows: 5, span: 4, hint: "One per line, shown in order." },
  { name: "bootSeconds", label: "Boot duration (s)", type: "number", step: "0.5", span: 2, hint: "1–6 seconds." },
  {
    name: "openOnLogin",
    label: "Open on arrival",
    type: "select",
    span: 3,
    options: [
      { value: "none", label: "Nothing — show the portrait" },
      { value: "about", label: "readme.txt" },
      { value: "projects", label: "Projects folder" },
    ],
  },
];

export default async function ProfilePage() {
  const { profile } = await getSiteContent();
  return (
    <>
      <PageHeader kicker="Content" title="Profile & settings" />
      <Card>
        <CardHeader>
          <CardTitle>Everything that isn&apos;t a list</CardTitle>
          <CardDescription>Name, copy, links, assets and the boot screen. Changes go live as soon as you save.</CardDescription>
        </CardHeader>
        <RecordForm
          fields={FIELDS}
          action={saveProfile}
          defaults={{
            ...profile,
            aboutBody: profile.aboutBody.join("\n\n"),
            bootMessages: profile.bootMessages.join("\n"),
          }}
        />
      </Card>
    </>
  );
}
