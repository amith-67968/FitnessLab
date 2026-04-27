"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Decorative orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <div className="pulse-dot" />
          <span className="text-sm text-white/70 font-medium">
            AI-Powered Fitness Analysis
          </span>
        </div>

        {/* Heading */}
        <h1 className="fade-in text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="text-white">Your AI</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Fitness Planner
          </span>
        </h1>

        {/* Subtitle */}
        <p className="fade-in stagger-2 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Get a personalized fitness blueprint powered by AI. Analyze your BMI,
          receive tailored diet plans, workout routines, and actionable health
          insights — all in seconds.
        </p>

        {/* CTA */}
        <div className="fade-in stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="cta-get-started"
            onClick={() => router.push("/auth")}
            className="btn-glow text-lg px-10 py-4"
          >
            Get Started
            <svg
              className="inline-block ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <span className="text-sm text-white/40">No credit card required</span>
        </div>

        {/* Stats */}
        <div className="fade-in stagger-4 mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "10K+", label: "Users" },
            { value: "98%", label: "Accuracy" },
            { value: "24/7", label: "AI Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="fade-in stagger-5 mt-20 grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3.422 3.422 0 01-4.83.006l-.17-.164a2.1 2.1 0 00-2.96 0l-2.47 2.47" />
                </svg>
              ),
              title: "BMI Analysis",
              desc: "Instant body mass index calculation with health category insights",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265z" />
                </svg>
              ),
              title: "Diet Plans",
              desc: "AI-curated meal plans tailored to your nutritional needs and goals",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              title: "Workout Plans",
              desc: "Personalized exercise routines with progressive timelines",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-card p-6 text-left hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
