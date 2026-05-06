import Cards from "@/components/Cards";
import { getSubjectColor } from "@/lib/utils";

type SessionRow = {
  id?: string;
  name?: string;
  topic?: string;
  subject?: string;
  duration?: number;
  sessionRowId?: string;
};

interface CompletedSessionCardsProps {
  sessions: SessionRow[];
}

const CompletedSessionCards = ({ sessions }: CompletedSessionCardsProps) => {
  if (sessions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-muted-foreground">
        No completed sessions yet. Finish a companion call to see it here.
      </p>
    );
  }

  return (
    <section className="companions-grid">
      {sessions.map((session, index) => {
        const id = String(session.id ?? "");
        const rowKey =
          session.sessionRowId != null &&
          String(session.sessionRowId) !== ""
            ? String(session.sessionRowId)
            : `${id || "row"}-${index}`;
        return (
          <Cards
            key={rowKey}
            id={id}
            name={String(session.name ?? "")}
            topic={String(session.topic ?? "")}
            subject={String(session.subject ?? "")}
            duration={Number(session.duration ?? 0)}
            color={getSubjectColor(String(session.subject ?? ""))}
            actionLabel="Open lesson"
          />
        );
      })}
    </section>
  );
};

export default CompletedSessionCards;
