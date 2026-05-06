import { getUserSessions } from "@/lib/actions/companion.actions";
import CompletedSessionCards from "@/components/CompletedSessionCards";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ComapnionsLib = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const completedSessions = await getUserSessions(user.id, 50);

  return (
    <main className="px-4 py-8 lg:mx-auto lg:max-w-4xl">
      <section className="mb-8">
        <h1 className="text-3xl font-bold">Completed Sessions</h1>
        <p className="mt-2 text-muted-foreground">
          Lessons you have completed, most recent first.
        </p>
      </section>

      <CompletedSessionCards sessions={completedSessions} />
    </main>
  );
};

export default ComapnionsLib;
