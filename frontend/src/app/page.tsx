"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const heroStats = [
  { value: "BMI-led", label: "Precise classification" },
  { value: "5 macros", label: "Daily nutrition targets" },
  { value: "8 weeks", label: "Structured workout flow" },
];

export default function LandingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAppContext();

  const handlePrimaryAction = () => {
    router.push(isLoggedIn ? "/questions" : "/auth");
  };

  return (
    <div className="landing-shell min-h-screen overflow-hidden pt-16 lg:h-screen lg:pt-16">
      <div className="landing-backdrop" />

      <section className="relative w-full overflow-hidden border-y border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:h-[calc(100vh-4rem)]">
        <div className="absolute inset-y-0 right-[38%] hidden w-px bg-slate-200/70 lg:block" />
        <div className="absolute left-1/3 top-0 h-full w-80 -translate-x-1/2 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12),_transparent_72%)]" />

        <div className="grid min-h-[680px] lg:h-full lg:grid-cols-[1.18fr_0.82fr]">
          <div className="relative flex items-center px-8 py-10 sm:px-12 lg:px-16 lg:py-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Intelligent Performance
              </div>

              <h1 className="mt-6 max-w-xl text-5xl font-black leading-[0.9] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[5.75rem]">
                <span className="block">Your AI</span>
                <span className="block text-blue-600">Fitness Planner.</span>
              </h1>

              <p className="mt-6 max-w-[44rem] text-lg leading-8 text-slate-600 sm:text-xl">
                Where scientific precision meets elite performance. Experience
                the next evolution of human potential driven by hyper-personalized
                data.
              </p>

              <div className="mt-9 flex items-center">
                <button
                  id="cta-begin-analysis"
                  onClick={handlePrimaryAction}
                  className="inline-flex min-w-[220px] items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Begin Analysis
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4"
                  >
                    <div className="text-lg font-bold text-slate-950">{stat.value}</div>
                    <div className="mt-1 text-sm leading-5 text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center px-8 py-8 sm:px-12 lg:px-10 lg:py-10">
            <div className="hero-visual-frame relative w-full max-w-[620px] overflow-visible rounded-[28px] bg-slate-950 shadow-[0_35px_70px_rgba(15,23,42,0.28)]">
              <div
                className="hero-athlete-image h-[500px] w-full rounded-[28px] bg-cover bg-center sm:h-[560px] lg:h-[min(68vh,780px)]"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.2)), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80')",
                }}
              />

              <div className="absolute inset-x-6 bottom-5 rounded-2xl bg-white/96 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.18)] backdrop-blur">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(74,222,128,0.16)]" />
                  Live AI Feedback Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
