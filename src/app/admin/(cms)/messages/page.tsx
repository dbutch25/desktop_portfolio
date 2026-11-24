import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMessage, setMessageRead } from "@/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <>
      <PageHeader kicker="Inbox" title="Messages" />
      {messages.length === 0 && <p className="text-neutral-700">No messages yet. They&apos;ll appear here and in your email.</p>}
      <div className="flex flex-col gap-s3">
        {messages.map((m) => (
          <Card key={m.id} id={m.id} className={m.read ? "opacity-80" : "border-brand/60"}>
            <div className="flex flex-wrap items-baseline gap-x-s3 gap-y-1">
              <span className="font-heading text-[17px] font-semibold">{m.subject || "(no subject)"}</span>
              {!m.read && <Badge>New</Badge>}
              {!m.emailed && <Badge variant="neutral">Not emailed</Badge>}
              <span className="ml-auto text-[12px] text-neutral-600 tabular-nums">
                {m.createdAt.toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <div className="text-[13px] text-neutral-700">
              {m.name} · <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "your message"))}`}>{m.email}</a>
            </div>
            <p className="m-0 text-[14px] whitespace-pre-wrap">{m.body}</p>
            <div className="flex flex-wrap gap-s2">
              <Button asChild size="sm">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "your message"))}`}>Reply</a>
              </Button>
              <form action={setMessageRead.bind(null, m.id, !m.read)}>
                <Button type="submit" variant="secondary" size="sm">
                  Mark as {m.read ? "unread" : "read"}
                </Button>
              </form>
              <span className="ml-auto">
                <DeleteButton action={deleteMessage.bind(null, m.id)} confirmText="Delete this message?" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
