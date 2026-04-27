"use client";

import React, { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ResultCard({
  title,
  icon,
  children,
  className = "",
}: ResultCardProps) {
  return (
    <div className={`glass-card p-6 fade-in ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="text-white/80 leading-relaxed">{children}</div>
    </div>
  );
}
