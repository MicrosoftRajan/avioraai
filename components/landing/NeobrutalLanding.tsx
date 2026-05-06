"use client";

import { continueHomeHref } from "@/lib/first-visit";
import IntegrationMap from "@/components/landing/IntegrationMap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  readThreeJsEnabledFromStorage,
  writeThreeJsEnabledToStorage,
} from "@/lib/threejs-toggle";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Globe3D = dynamic(
  () => import("@/components/ui/3d-globe").then((m) => m.Globe3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[300px] w-full items-center justify-center bg-[#fde047] text-xs font-bold uppercase tracking-widest text-black/45">
        Loading globe…
      </div>
    ),
  }
);

const neoBorder = "border-[3px] border-black";
const neoShadow = "shadow-[6px_6px_0_0_#000]";
const neoShadowSm = "shadow-[4px_4px_0_0_#000]";

const DEMO_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

/** Reported website / experience accuracy (0–100) for the circular chart. */
const WEBSITE_ACCURACY_PERCENT = 94;

function AccuracyDonut({ visible }: { visible: boolean }) {
  const cx = 110;
  const cy = 110;
  const r = 82;
  const stroke = 18;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - WEBSITE_ACCURACY_PERCENT / 100);
  const progressRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const node = progressRef.current;
    if (!node) return;
    gsap.to(node, {
      strokeDashoffset: visible ? offset : c,
      duration: visible ? 1.35 : 0.35,
      ease: visible ? "power2.out" : "power2.in",
    });
  }, [visible, offset, c]);

  return (
    <div
      className={`relative mx-auto flex aspect-square w-full max-w-[min(100%,320px)] items-center justify-center ${neoBorder} ${neoShadow} bg-white p-4`}
    >
      <svg
        viewBox="0 0 220 220"
        className="size-full max-h-[280px] max-w-[280px]"
        aria-label={`Website accuracy ${WEBSITE_ACCURACY_PERCENT} percent`}
        role="img"
      >
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-slate-200"
          />
          <circle
            ref={progressRef}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={c}
            strokeDashoffset={c}
            className="stroke-[#22d3ee]"
          />
        </g>
        {/* Outer rim */}
        <circle
          cx={cx}
          cy={cy}
          r={r + stroke / 2 + 2}
          fill="none"
          stroke="#000"
          strokeWidth={3}
          pointerEvents="none"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r - stroke / 2 - 2}
          fill="none"
          stroke="#000"
          strokeWidth={3}
          pointerEvents="none"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1">
        <span className="text-5xl font-black tabular-nums md:text-6xl">
          {WEBSITE_ACCURACY_PERCENT}
          <span className="align-top text-3xl font-black md:text-4xl">%</span>
        </span>
        <span className="mt-1 text-xs font-extrabold uppercase tracking-widest text-black/70">
          accuracy
        </span>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Sessions feel structured and fast. Our team adopted Aviora without a long onboarding curve.",
    name: "Alex R.",
    role: "Founder, NovaLab",
  },
  {
    quote:
      "The voice-first flow keeps students engaged. We track progress in one place now.",
    name: "Priya S.",
    role: "Head of Learning, Northline",
  },
  {
    quote:
      "Finally a teaching companion that matches how we actually run cohorts.",
    name: "Jordan M.",
    role: "Curriculum Lead",
  },
  {
    quote:
      "Neat integration with our weekly rhythm—less prep, more live practice.",
    name: "Casey L.",
    role: "Engineering Educator",
  },
  {
    quote:
      "Parents see clearer outcomes; instructors get time back every week.",
    name: "Sam T.",
    role: "Program Director",
  },
  {
    quote:
      "We stress-tested it across subjects; consistency stayed high across groups.",
    name: "Riley D.",
    role: "Ops Manager",
  },
];

const testimonialStackBgs = ["bg-white", "bg-[#fef9c3]", "bg-[#fce7f3]"] as const;

export default function NeobrutalLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [graphEntered, setGraphEntered] = useState(false);
  const [showThree, setShowThree] = useState(true);
  const threeToggleRef = useRef<HTMLButtonElement | null>(null);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialCount = testimonials.length;
  const stackLayers = [2, 1, 0] as const; // back → front draw order
  const testimonialFrontRef = useRef<HTMLElement | null>(null);

  const goPrevTestimonial = () => {
    setTestimonialIndex((i) => (i - 1 + testimonialCount) % testimonialCount);
  };
  const goNextTestimonial = () => {
    setTestimonialIndex((i) => (i + 1) % testimonialCount);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const liftCleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      if (!reduced) {
        const intro = root.querySelectorAll(".landing-hero-intro > *");
        if (intro.length) {
          gsap.from(intro, {
            opacity: 0,
            y: 32,
            duration: 0.65,
            stagger: 0.11,
            ease: "power3.out",
            delay: 0.05,
          });
        }
        const heroImg = root.querySelector(".landing-hero-image");
        if (heroImg) {
          gsap.from(heroImg, {
            opacity: 0,
            x: 48,
            duration: 0.75,
            ease: "power3.out",
            delay: 0.2,
          });
        }
      }

      const bindReveal = (
        sectionSelector: string,
        childSelector: string,
        stagger = 0.1
      ) => {
        const section = root.querySelector(sectionSelector);
        if (!section) return;
        const els = section.querySelectorAll(childSelector);
        if (!els.length) return;
        if (reduced) {
          gsap.set(els, { clearProps: "all" });
          return;
        }
        gsap.set(els, { opacity: 0, y: 40 });
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      };

      bindReveal("#goals", "[data-gsap-reveal]", 0.12);
      bindReveal("#demo", "[data-gsap-reveal]", 0.1);
      bindReveal("#metrics", "[data-gsap-reveal]", 0.1);
      bindReveal("#testimonials", "[data-gsap-reveal]", 0.12);
      bindReveal("#aviora", "[data-gsap-reveal]", 0.15);

      const metrics = root.querySelector("#metrics");
      if (metrics) {
        ScrollTrigger.create({
          trigger: metrics,
          start: "top 78%",
          onEnter: () => setGraphEntered(true),
          once: true,
        });
      }

      root.querySelectorAll<HTMLElement>("[data-neo-lift]").forEach((el) => {
        const enter = () => {
          gsap.to(el, {
            y: -10,
            scale: 1.02,
            rotation: -0.75,
            duration: 0.38,
            ease: "power2.out",
          });
        };
        const leave = () => {
          gsap.to(el, {
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.45,
            ease: "power2.out",
          });
        };
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        liftCleanups.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        });
      });

      const hero = heroSectionRef.current;
      const title = root.querySelector<HTMLElement>(".landing-hero-title");
      if (hero && title && !reduced) {
        const moveX = gsap.quickTo(title, "x", {
          duration: 0.55,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(title, "y", {
          duration: 0.55,
          ease: "power3.out",
        });
        const onMove = (e: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          moveX(px * 14);
          moveY(py * 10);
        };
        const onLeave = () => {
          moveX(0);
          moveY(0);
        };
        hero.addEventListener("mousemove", onMove);
        hero.addEventListener("mouseleave", onLeave);
        liftCleanups.push(() => {
          hero.removeEventListener("mousemove", onMove);
          hero.removeEventListener("mouseleave", onLeave);
        });
      }
    }, root);

    return () => {
      liftCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const el = testimonialFrontRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { scale: 0.96, opacity: 0.85 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }
    );
  }, [testimonialIndex]);

  useEffect(() => {
    setShowThree(readThreeJsEnabledFromStorage(true));
    const onEvt = (e: Event) => {
      const ce = e as CustomEvent<{ enabled: boolean }>;
      if (ce?.detail?.enabled != null) setShowThree(ce.detail.enabled);
    };
    window.addEventListener("aviora:threejs", onEvt);
    return () => window.removeEventListener("aviora:threejs", onEvt);
  }, []);

  useEffect(() => {
    if (!threeToggleRef.current) return;
    gsap.fromTo(
      threeToggleRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.25, ease: "back.out(2)" }
    );
  }, [showThree]);

  return (
    <div
      ref={rootRef}
      className="w-full bg-[#fffef5] text-black tracking-wide"
    >
      {/* —— Hero —— */}
      <section
        ref={heroSectionRef}
        className="relative flex min-h-[100dvh] flex-col border-b-[3px] border-black bg-[#fde047]"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 px-4 py-16 pt-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="landing-hero-intro max-w-xl text-center md:text-left">
            <p
              className={`mb-4 inline-flex items-center gap-2 ${neoBorder} ${neoShadowSm} bg-white px-4 py-2 text-sm font-bold uppercase`}
            >
              <span className="inline-block size-2 rounded-full bg-black" />
              Learn with Aviora
            </p>
            <h1 className="landing-hero-title will-change-transform text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Teach, practice, and grow—without the busywork.
            </h1>
            <p className="mt-6 text-lg font-semibold text-black/80 md:text-xl">
              AI companions for real sessions. Bold tools for bold outcomes.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <Link
                href="/sign-in"
                data-neo-lift
                className={`inline-flex items-center gap-2 bg-black px-6 py-3 text-sm font-bold uppercase text-white ${neoBorder} ${neoShadow}`}
              >
                Get started
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href="#goals"
                data-neo-lift
                className={`inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-bold uppercase ${neoBorder} ${neoShadowSm}`}
              >
                Scroll for goals
                <ArrowDown className="size-4" aria-hidden />
              </a>
              <Link
                href={continueHomeHref}
                data-neo-lift
                className={`inline-flex items-center gap-2 bg-[#86efac] px-6 py-3 text-sm font-bold uppercase ${neoBorder} ${neoShadowSm}`}
              >
                Continue to app
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <button
                ref={threeToggleRef}
                type="button"
                onClick={() => {
                  const next = !showThree;
                  setShowThree(next);
                  writeThreeJsEnabledToStorage(next);
                }}
                data-neo-lift
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase ${neoBorder} ${neoShadowSm} ${
                  showThree ? "bg-[#e0f2fe]" : "bg-white"
                }`}
                aria-pressed={showThree}
              >
                Interview Mode
                <span className="ml-2 rounded-full border border-black bg-[#fde047] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                  Coming soon
                </span>
              </button>
            </div>
          </div>

          <div
            data-neo-lift
            className="landing-hero-image relative w-full max-w-md overflow-hidden bg-[#fde047]"
          >
            {showThree ? (
              <Globe3D
                className="mx-auto h-[min(52vh,440px)] min-h-[280px] w-full max-w-md md:min-h-[360px]"
                config={{
                  backgroundColor: "transparent",
                  autoRotateSpeed: 0.35,
                  enableZoom: true,
                  enablePan: false,
                  minDistance: 3.5,
                  maxDistance: 14,
                  showAtmosphere: true,
                  atmosphereColor: "#38bdf8",
                  atmosphereIntensity: 0.45,
                }}
              />
            ) : (
              <div className="flex min-h-[280px] w-full items-center justify-center md:min-h-[360px]">
                <div
                  className={`flex flex-col items-center gap-2 ${neoBorder} ${neoShadowSm} bg-white px-6 py-5 text-center`}
                >
                  <p className="text-xs font-black uppercase tracking-widest text-black/70">
                    Three.js disabled
                  </p>
                  <p className="max-w-[22ch] text-sm font-semibold text-black/80">
                    Turn it on for the interactive globe.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <a
          href="#goals"
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-bold uppercase"
          aria-label="Scroll to goals"
        >
          <span className="animate-bounce">
            <ArrowDown className="size-6" />
          </span>
        </a>
      </section>

      {/* —— Goals (fade in on scroll) —— */}
      <section
        id="goals"
        className="border-b-[3px] border-black bg-[#a5f3fc] px-4 py-24 md:py-32"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            data-gsap-reveal
            className={`mx-auto mb-6 inline-block ${neoBorder} ${neoShadowSm} bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest`}
          >
            Our goals
          </p>
          <h2
            data-gsap-reveal
            className="text-3xl font-extrabold leading-tight md:text-5xl"
          >
            Empower every learner with clarity, speed, and confidence.
          </h2>
          <p
            data-gsap-reveal
            className="mx-auto mt-8 max-w-2xl text-base font-semibold text-black/80 md:text-lg"
          >
            We build tools that feel direct and human: structured sessions, honest
            feedback, and workflows your team can repeat every week.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Efficiency",
                body: "Ship lessons faster with prompts and flows tuned for teaching—not generic chat.",
                bg: "bg-[#fef08e]",
              },
              {
                title: "Versatile",
                body: "Across subjects and cohort sizes, keep one rhythm: prepare, run, review.",
                bg: "bg-[#fda4af]",
              },
              {
                title: "Seamless",
                body: "From first sign-in to recap, reduce friction so energy stays in the room.",
                bg: "bg-[#c4b5fd]",
              },
            ].map((card, index) => (
              <article
                key={card.title}
                data-gsap-reveal
                data-neo-lift
                className={`flex flex-col gap-4 p-6 text-left ${neoBorder} ${neoShadow} ${card.bg}`}
              >
                <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-black bg-white font-black">
                  {index + 1}
                </div>
                <h3 className="text-xl font-extrabold">{card.title}</h3>
                <p className="text-sm font-semibold leading-relaxed text-black/85">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* —— Video —— */}
      <section
        id="demo"
        className="border-b-[3px] border-black bg-white px-4 py-24 md:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p
              data-gsap-reveal
              className={`mx-auto mb-4 inline-block ${neoBorder} ${neoShadowSm} bg-[#fde047] px-5 py-2 text-xs font-bold uppercase`}
            >
              How it works
            </p>
            <h2
              data-gsap-reveal
              className="text-3xl font-extrabold md:text-4xl"
            >
              See the application in motion
            </h2>
            <p
              data-gsap-reveal
              className="mx-auto mt-4 max-w-2xl font-semibold text-black/75"
            >
              Replace the sample clip with your product walkthrough—drop in a hosted
              MP4 or embed when you are ready.
            </p>
          </div>

          <div
            data-gsap-reveal
            data-neo-lift
            className={`relative overflow-hidden ${neoBorder} ${neoShadow} bg-black`}
          >
            <div className="aspect-video w-full">
              <video
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/images/landing-hero.png"
              >
                <source src={DEMO_VIDEO} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            </div>
            <div className="flex items-center justify-between gap-4 border-t-[3px] border-black bg-[#86efac] px-4 py-3 text-sm font-bold uppercase">
              <span className="flex items-center gap-2">
                <Play className="size-4 fill-black" aria-hidden />
                Product demo
              </span>
              <span className="hidden sm:inline">Controls enabled</span>
            </div>
          </div>
        </div>
      </section>

      {/* —— Graph —— */}
      <section
        id="metrics"
        className="border-b-[3px] border-black bg-[#fbcfe8] px-4 py-24 md:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p
              data-gsap-reveal
              className={`mx-auto mb-4 inline-block ${neoBorder} ${neoShadowSm} bg-white px-5 py-2 text-xs font-bold uppercase`}
            >
              Impact
            </p>
            <h2
              data-gsap-reveal
              className="text-3xl font-extrabold md:text-4xl"
            >
              Website accuracy—measured in one clear ring
            </h2>
            <p
              data-gsap-reveal
              className="mx-auto mt-4 max-w-2xl font-semibold text-black/75"
            >
              Composite score across session quality, guidance match, and learner
              outcomes—swap in live data when your analytics feed is ready.
            </p>
          </div>

          <div
            data-gsap-reveal
            data-neo-lift
            className={`flex flex-col items-stretch gap-10 md:flex-row md:items-center md:justify-between ${neoBorder} ${neoShadow} bg-white p-6 md:p-10`}
          >
            <div
              data-neo-lift
              className="flex flex-1 flex-col items-center justify-center border-[3px] border-black bg-[#f0f9ff] p-8 md:min-h-[340px]"
            >
              <AccuracyDonut visible={graphEntered} />
              <p className="mt-8 max-w-sm text-center text-sm font-bold uppercase tracking-wide text-black/80">
                Ring fills as you scroll into view—full sweep is{" "}
                {WEBSITE_ACCURACY_PERCENT}% platform accuracy
              </p>
            </div>

            <aside
              data-neo-lift
              className="flex w-full max-w-md flex-col gap-4 border-[3px] border-black bg-[#fde047] p-5 font-bold md:w-[280px] md:shrink-0"
            >
              <p className="text-sm uppercase tracking-widest">How to read it</p>
              <ul className="space-y-3 text-sm leading-snug">
                <li>
                  <span className="block text-xs uppercase text-black/70">
                    Ring
                  </span>
                  One full circle equals 100%—the cyan arc is your current accuracy
                  score.
                </li>
                <li>
                  <span className="block text-xs uppercase text-black/70">
                    Center
                  </span>
                  The bold number matches the arc so visitors get the headline stat
                  instantly.
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* —— Testimonials —— */}
      <section
        id="testimonials"
        className="border-b-[3px] border-black bg-[#d9f99d] px-4 py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p
              data-gsap-reveal
              className={`mx-auto mb-4 inline-block ${neoBorder} ${neoShadowSm} bg-white px-5 py-2 text-xs font-bold uppercase`}
            >
              Testimonials
            </p>
            <h2
              data-gsap-reveal
              className="text-3xl font-extrabold md:text-4xl"
            >
              Built for teams. Backed by real outcomes.
            </h2>
          </div>

          <div
            data-gsap-reveal
            className="mx-auto flex max-w-3xl flex-col items-center gap-6 md:flex-row md:items-stretch md:gap-4"
          >
            <button
              type="button"
              onClick={goPrevTestimonial}
              aria-label="Previous testimonial"
              data-neo-lift
              className={`flex size-12 shrink-0 items-center justify-center self-center md:self-auto ${neoBorder} ${neoShadowSm} bg-white text-black md:mt-24`}
            >
              <ChevronLeft className="size-7" strokeWidth={3} aria-hidden />
            </button>

            <div
              data-neo-lift
              className="relative mx-auto h-[min(72vw,340px)] w-full max-w-lg md:h-[360px]"
              aria-roledescription="carousel"
            >
              <p className="sr-only" aria-live="polite">
                {testimonials[testimonialIndex].name}:{" "}
                {testimonials[testimonialIndex].quote}
              </p>
              {stackLayers.map((depth) => {
                const cardIndex =
                  (testimonialIndex + depth) % testimonialCount;
                const t = testimonials[cardIndex];
                const isFront = depth === 0;
                const tx = depth * 14;
                const ty = depth * 12;
                const scale = 1 - depth * 0.035;
                const z = 30 - depth;

                return (
                  <figure
                    ref={isFront ? testimonialFrontRef : undefined}
                    key={`stack-slot-${depth}`}
                    className={`absolute left-0 right-0 top-0 flex min-h-[260px] flex-col gap-4 p-6 md:min-h-[300px] ${neoBorder} ${neoShadow} ${
                      testimonialStackBgs[depth % testimonialStackBgs.length]
                    } ${isFront ? "cursor-default" : "pointer-events-none"}`}
                    style={{
                      zIndex: z,
                      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                      opacity: isFront ? 1 : 0.92 - depth * 0.06,
                      transition:
                        "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease",
                    }}
                    aria-hidden={!isFront}
                  >
                    <blockquote className="text-sm font-semibold leading-relaxed md:text-base">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-auto border-t-[3px] border-black pt-4 text-xs font-extrabold uppercase md:text-sm">
                      {t.name}
                      <span className="mt-1 block font-bold text-black/70">
                        {t.role}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goNextTestimonial}
              aria-label="Next testimonial"
              data-neo-lift
              className={`flex size-12 shrink-0 items-center justify-center self-center md:self-auto ${neoBorder} ${neoShadowSm} bg-white text-black md:mt-24`}
            >
              <ChevronRight className="size-7" strokeWidth={3} aria-hidden />
            </button>
          </div>

          <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-black/60">
            {testimonialIndex + 1} / {testimonialCount}
          </p>
        </div>
      </section>

      {/* —— Models & integration map —— */}
      <section id="aviora" className="bg-[#fef3c7] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div
            data-neo-lift
            className="flex flex-col gap-8 p-0 md:p-0"
          >
            <div className="text-center">
              <p
                data-gsap-reveal
                className="text-sm font-bold uppercase tracking-[0.35em]"
              >
                The learning layer
              </p>
              <h2
                data-gsap-reveal
                className="mt-3 text-2xl font-extrabold md:text-3xl"
              >
                Models we use & how they plug in
              </h2>
              <p
                data-gsap-reveal
                className="mx-auto mt-2 max-w-xl text-sm font-semibold text-black/75 md:text-base"
              >
                Transit-style map: each stop is a real integration path. Hover a
                stop to stress its route—lines draw in as you scroll.
              </p>
            </div>

            <div data-gsap-reveal>
              <IntegrationMap />
            </div>

            <div
              data-gsap-reveal
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Link
                href="/sign-in"
                data-neo-lift
                className={`inline-flex items-center gap-2 bg-black px-8 py-4 text-sm font-bold uppercase text-white ${neoBorder} ${neoShadowSm}`}
              >
                Sign in
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={continueHomeHref}
                data-neo-lift
                className={`inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-bold uppercase ${neoBorder} ${neoShadowSm}`}
              >
                Continue to app
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
