import HomePage from "@/components/home/HomePage";
import NeobrutalLanding from "@/components/landing/NeobrutalLanding";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const user = await currentUser();
  if (user) {
    return <HomePage />;
  }

  return (
    <main className="mx-0 flex w-full max-w-none flex-col gap-0 bg-transparent px-0 pt-0">
      <NeobrutalLanding />
    </main>
  );
}
