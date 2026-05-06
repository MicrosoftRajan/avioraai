'use client';

import { PricingTable, SignInButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { useState } from 'react';

const billingToggleClass =
  'rounded-full border-4 border-black bg-white px-1 py-1 text-sm font-black shadow-[4px_4px_0_0_#000]';

const neoPricingAppearance = {
  variables: {
    colorPrimary: '#1d4ed8',
    colorText: '#0a0a0a',
    colorTextSecondary: '#404040',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorDanger: '#dc2626',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: '1rem',
    borderRadius: '1.25rem',
  },
  elements: {
    rootBox: 'w-full',
    card: 'border-4 border-black shadow-[6px_6px_0_0_#000] rounded-3xl',
    headerTitle: 'font-black tracking-tight',
    headerSubtitle: 'font-semibold text-neutral-700',
    pricingTable: 'gap-6',
  },
};

export function SubscriptionNeo() {
  const [cycle, setCycle] = useState<'month' | 'year'>('month');
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#d4cfc6] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-3xl font-black tracking-tight text-black sm:text-4xl md:text-5xl">
          A transformative speaking subscription!
        </h1>

        <div className="mt-8 flex justify-center">
          <div
            className={billingToggleClass}
            role="tablist"
            aria-label="Billing period"
          >
            <button
              type="button"
              role="tab"
              aria-selected={cycle === 'month'}
              onClick={() => setCycle('month')}
              className={
                cycle === 'month'
                  ? 'rounded-full bg-blue-700 px-6 py-2.5 font-black text-white'
                  : 'rounded-full px-6 py-2.5 font-black text-black hover:bg-neutral-100'
              }
            >
              Month
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={cycle === 'year'}
              onClick={() => setCycle('year')}
              className={
                cycle === 'year'
                  ? 'rounded-full bg-blue-700 px-6 py-2.5 font-black text-white'
                  : 'rounded-full px-6 py-2.5 font-black text-black hover:bg-neutral-100'
              }
            >
              Year
            </button>
          </div>
        </div>

        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-semibold text-neutral-800">
          {cycle === 'month'
            ? 'Monthly billing — pick a plan below. (Match monthly prices in Clerk Dashboard.)'
            : 'Annual billing — pick a plan below. (Match annual prices in Clerk Dashboard.)'}
        </p>

        {isLoaded && !isSignedIn ? (
          <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-2xl border-4 border-black bg-amber-200 px-6 py-4 text-center shadow-[6px_6px_0_0_#000]">
            <p className="font-black text-black">
              Sign in to subscribe with Clerk Billing.
            </p>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-full border-4 border-black bg-white px-6 py-2.5 text-sm font-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                Sign in
              </button>
            </SignInButton>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-stretch gap-8 lg:flex-row lg:items-start">
          <aside className="mx-auto flex w-full max-w-[280px] shrink-0 flex-col gap-3 lg:mx-0">
            <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
              <p className="mb-3 text-center text-xs font-black uppercase tracking-widest text-neutral-600">
                Credits
              </p>
              <Image
                src="/icons/coin.svg"
                alt=""
                width={220}
                height={220}
                unoptimized
                className="mx-auto h-48 w-48 object-contain"
              />
            </div>
            <p className="text-center text-xs font-bold leading-snug text-neutral-800">
              Plans and checkout are powered by{' '}
              <span className="font-black">Clerk Subscription</span> (Billing).
            </p>
          </aside>

          <div className="min-w-0 flex-1 rounded-3xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_0_#000] sm:p-6">
            <PricingTable
              appearance={neoPricingAppearance}
              newSubscriptionRedirectUrl="/"
              for="user"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
