import HomePage from "@/components/home/HomePage";
import NeobrutalLanding from "@/components/landing/NeobrutalLanding";
import { RETURNING_VISITOR_COOKIE } from "@/lib/first-visit";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export default async function Page() {
  const user = await currentUser();
  if (user) {
    return <HomePage />;
  }

  const jar = await cookies();
  if (!jar.get(RETURNING_VISITOR_COOKIE)) {
    return (
      <main className="mx-0 flex w-full max-w-none flex-col gap-0 bg-transparent px-0 pt-0">
        <NeobrutalLanding />
      </main>
    );
  }

  return <HomePage />;
}
