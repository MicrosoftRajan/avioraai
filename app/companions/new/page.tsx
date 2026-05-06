import Form from "@/components/Form";
import { redirect } from "next/navigation";
import {auth} from '@clerk/nextjs/server'

import React from "react";

const NewCompanion = async () => {
  const {userId} = await auth();
  if(!userId) redirect('/sign-in')
    
  return (
    <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center ">
      <article className="w-full gap-4 flex flex-col">
        <h1>Fill Your Favorite Courses</h1>
        <Form />
      </article>
    </main>
  );
};

export default NewCompanion;
