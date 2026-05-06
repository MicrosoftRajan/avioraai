'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import {
  readThreeJsEnabledFromStorage,
  writeThreeJsEnabledToStorage,
} from "@/lib/threejs-toggle";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [threeEnabled, setThreeEnabled] = React.useState(true);

  React.useEffect(() => {
    setThreeEnabled(readThreeJsEnabledFromStorage(true));
    const onEvt = (e: Event) => {
      const ce = e as CustomEvent<{ enabled: boolean }>;
      if (ce?.detail?.enabled != null) setThreeEnabled(ce.detail.enabled);
    };
    window.addEventListener("aviora:threejs", onEvt);
    const onStorage = () => setThreeEnabled(readThreeJsEnabledFromStorage(true));
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("aviora:threejs", onEvt);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image src="/images/logo.svg" alt="logo" width={46} height={44} />
        </div>
      </Link>

      <div className="flex items-center gap-8">
        <NavItems />
        <button
          type="button"
          onClick={() => {
            const next = !threeEnabled;
            setThreeEnabled(next);
            writeThreeJsEnabledToStorage(next);
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] transition-transform hover:-translate-y-0.5",
            threeEnabled && "bg-[#e0f2fe]",
          )}
          aria-pressed={threeEnabled}
          title="Interview Mode (coming soon)"
        >
          <Sparkles className="size-4" aria-hidden />
          <span>Interview Mode</span>
          <span className="ml-1 rounded-full border border-black bg-[#fde047] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
            Coming soon
          </span>
        </button>
        {isLoaded && !isSignedIn ? (
          <SignInButton>
            <button className="btn-signin" type="button">Sign In</button>
          </SignInButton>
        ) : null}

        {isLoaded && isSignedIn ? <UserButton /> : null}
      </div>
    </nav>
  );
};

export default Navbar;
