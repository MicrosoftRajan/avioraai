"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Stops on the map (x/y in viewBox 0–100 space). Center hub at (50, 50). */
const MAP_STOPS = [
  {
    id: "openai",
    label: "GPT / OpenAI",
    hint: "Structured outputs & streaming for live sessions",
    x: 50,
    y: 14,
    line: "A",
    color: "bg-[#e0f2fe]",
  },
  {
    id: "anthropic",
    label: "Claude",
    hint: "Long-context tutoring & rubrics",
    x: 86,
    y: 38,
    line: "B",
    color: "bg-[#ffedd5]",
  },
  {
    id: "vapi",
    label: "Vapi voice",
    hint: "Low-latency speech for companions",
    x: 14,
    y: 38,
    line: "C",
    color: "bg-[#dcfce7]",
  },
  {
    id: "supabase",
    label: "Supabase",
    hint: "Sessions, progress, and sync",
    x: 72,
    y: 78,
    line: "D",
    color: "bg-[#ede9fe]",
  },
  {
    id: "clerk",
    label: "Clerk",
    hint: "Auth & identities at the edge",
    x: 28,
    y: 78,
    line: "E",
    color: "bg-[#fce7f3]",
  },
] as const;

export default function IntegrationMap() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hubRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const lines = root.querySelectorAll<SVGLineElement>(".map-route");
    const nodes = root.querySelectorAll<HTMLElement>("[data-map-node]");

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        const len = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: len,
          strokeDashoffset: reduced ? 0 : len,
        });
        if (!reduced) {
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      if (!reduced && hubRef.current) {
        gsap.to(hubRef.current, {
          scale: 1.05,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      nodes.forEach((node) => {
        const enter = () => {
          gsap.to(node, {
            scale: 1.06,
            y: "-=3",
            duration: 0.35,
            ease: "back.out(2)",
          });
          const lineId = node.getAttribute("data-line-for");
          if (!lineId) return;
          const ln = root.querySelector(`[data-line-id="${lineId}"]`);
          if (ln)
            gsap.to(ln, {
              opacity: 1,
              attr: { "stroke-width": 0.95 },
              duration: 0.22,
            });
        };
        const leave = () => {
          gsap.to(node, {
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          });
          const lineId = node.getAttribute("data-line-for");
          if (!lineId) return;
          const ln = root.querySelector(`[data-line-id="${lineId}"]`);
          if (ln)
            gsap.to(ln, {
              opacity: 0.5,
              attr: { "stroke-width": 0.55 },
              duration: 0.28,
            });
        };
        node.addEventListener("mouseenter", enter);
        node.addEventListener("mouseleave", leave);
        node.addEventListener("focus", enter);
        node.addEventListener("blur", leave);
        cleanups.push(() => {
          node.removeEventListener("mouseenter", enter);
          node.removeEventListener("mouseleave", leave);
          node.removeEventListener("focus", enter);
          node.removeEventListener("blur", leave);
        });
      });
    }, root);

    return () => {
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-2xl select-none"
      aria-label="Integration map: models connected to Aviora"
    >
      <div className="mb-3 flex items-center justify-between border-b-[3px] border-black pb-2 text-[10px] font-black uppercase tracking-widest text-black/70">
        <span>North</span>
        <span>Integration map</span>
        <span>v1</span>
      </div>

      <div className="relative aspect-[5/4] w-full min-h-[280px] md:min-h-[320px]">
        <svg
          className="absolute inset-0 h-full w-full text-black"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <pattern
              id="map-grid"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 5 0 L 0 0 0 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.08"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect
            width="100"
            height="100"
            fill="url(#map-grid)"
            className="text-black"
          />
          {MAP_STOPS.map((s) => (
            <line
              key={`line-${s.id}`}
              data-line-id={s.id}
              className="map-route"
              x1="50"
              y1="50"
              x2={s.x}
              y2={s.y}
              stroke="currentColor"
              strokeWidth="0.55"
              strokeLinecap="square"
              opacity={0.55}
            />
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <button
            ref={hubRef}
            type="button"
            className="flex flex-col items-center justify-center border-[3px] border-black bg-[#fef08e] px-4 py-3 text-center shadow-[4px_4px_0_0_#000] outline-none ring-black focus-visible:ring-2"
            style={{ transformOrigin: "50% 50%" }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-black/70">
              Hub
            </span>
            <span className="text-lg font-black tracking-tight md:text-xl">
              AVIORA
            </span>
          </button>
        </div>

        {MAP_STOPS.map((s) => (
          <button
            key={s.id}
            type="button"
            data-map-node
            data-line-for={s.id}
            className={`absolute z-10 flex max-w-[42%] -translate-x-1/2 -translate-y-1/2 flex-col gap-0.5 border-[3px] border-black px-2.5 py-2 text-left shadow-[3px_3px_0_0_#000] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-black md:max-w-[38%] ${s.color}`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transformOrigin: "center center",
            }}
          >
            <span className="inline-flex w-fit border border-black bg-black px-1 py-0.5 text-[8px] font-black text-white">
              Line {s.line}
            </span>
            <span className="text-[11px] font-extrabold leading-tight md:text-xs">
              {s.label}
            </span>
            <span className="hidden text-[9px] font-semibold leading-snug text-black/75 sm:block">
              {s.hint}
            </span>
          </button>
        ))}
      </div>

      <ol className="mt-4 space-y-2 border-[3px] border-black bg-white p-3 text-left text-xs font-semibold leading-snug text-black/85 md:text-sm">
        <li>
          <span className="font-black text-black">1.</span> Add API keys in your
          dashboard (models + voice).
        </li>
        <li>
          <span className="font-black text-black">2.</span> Connect Clerk + Supabase
          env vars—sessions sync automatically.
        </li>
        <li>
          <span className="font-black text-black">3.</span> Ship: companions call
          models through Aviora&apos;s unified session layer.
        </li>
      </ol>
    </div>
  );
}
