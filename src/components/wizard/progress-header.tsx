"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FORMULAR_SCHRITTE } from "@/lib/wizard-context";

const SCHRITT_TITEL = [
  "",
  "Grunddaten",
  "Schwerbehinderung",
  "Schule und Studium",
  "Beruflicher Werdegang",
  "Motivation und Anlagen",
  "Prüfen und absenden",
];

export function ProgressHeader({ step }: { step: number }) {
  const zeigeFortschritt = step >= 1 && step <= FORMULAR_SCHRITTE;

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-5 py-3">
        <Image
          // basePath muss bei unoptimized-Bildern manuell davor (Next.js-Eigenheit)
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/sh-logo.png`}
          alt="Schleswig-Holstein. Der echte Norden"
          width={132}
          height={44}
          className="h-9 w-auto"
          priority
        />
        {zeigeFortschritt && (
          <p className="text-[13px] font-medium tabular-nums text-muted-foreground">
            Schritt {step} von {FORMULAR_SCHRITTE}
          </p>
        )}
      </div>

      {zeigeFortschritt && (
        <div className="mx-auto w-full max-w-2xl px-5 pb-3">
          <p className="mb-2 text-lg font-bold leading-tight text-primary">
            {SCHRITT_TITEL[step]}
          </p>
          {/* Segmentierter Fortschrittsbalken: ein Segment pro Schritt */}
          <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={FORMULAR_SCHRITTE} aria-valuenow={step}>
            {Array.from({ length: FORMULAR_SCHRITTE }, (_, i) => (
              <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
