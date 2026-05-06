# Aviora

Aviora is a modern interview-prep and career companion for job seekers. The goal is to simulate a real interview environment, help you practice consistently, and improve faster with structured feedback.

---

## Vision

- **Real interview environment**: timed rounds, realistic question flow, pressure-friendly UX, and role-based tracks.
- **Personalized preparation**: questions adapt to your level, target role, and weak areas.
- **Actionable feedback**: rubric-based scoring, strengths/weaknesses, and a concrete improvement plan after every session.
- **One place for the journey**: practice, track progress, and iterate until you’re ready.

---

## Roadmap (Phases)

### Phase 0 — Foundation (Current)

- Landing + onboarding experiences
- Authentication and session handling
- Reusable UI system and animations

### Phase 1 — Core Practice Loop

- Role/stack selection (e.g., Frontend / Backend / Fullstack)
- Question bank with difficulty levels
- Practice sessions with saved history

### Phase 2 — Upcoming: Interview Mode (Real Interview Simulation)

Interview Mode is designed to feel like a real recruiter/technical interview:

- **Rounds**: HR / Technical / System Design (configurable by role)
- **Realistic prompts**: curated questions + follow-ups + “why” questions
- **Timer & pacing**: timeboxed answers, cooldown, and “think time”
- **Evaluation rubric**: communication, correctness, depth, trade-offs, clarity
- **Session report**: score breakdown + improvement plan + recommended next session
- **Voice-first option (optional)**: interactive interview using web voice tooling

### Phase 3 — Job-Seeker Toolkit

- Resume / portfolio checklist
- Job application tracker
- Weekly plan generator (based on your target role and timeline)

### Phase 4 — Insights & Growth

- Progress analytics over time
- Weak-area detection and targeted drills
- Shareable “readiness report”

---

## Tech Stack (Used in this project)

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Language**: TypeScript
- **UI**: Tailwind CSS v4, shadcn/ui-style patterns, Radix UI primitives
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database / Backend services**: Supabase (`@supabase/supabase-js`)
- **Forms & validation**: React Hook Form + Zod
- **Animation**: GSAP, Motion, Lottie
- **3D / Visuals**: Three.js + React Three Fiber + Drei
- **Voice (web)**: Vapi (`@vapi-ai/web`)
- **Tooling**: ESLint (Next.js config)

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file (don’t commit it). Example:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Vapi (if using voice mode)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
```

### Run locally

```bash
npm run dev
```

---

## Project Structure (high level)

- `app/`: Next.js App Router pages/routes
- `components/`: shared + feature components
- `lib/`: utilities and shared logic
- `public/`: static assets (images/icons)

---

## Notes

- If you see assets under `public/readme/`, they can be used for README visuals (optional).
- This README intentionally avoids including any real keys or secrets.