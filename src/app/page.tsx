"use client";

import { AnimatePresence, motion } from "motion/react";
import { WizardProvider, useWizard } from "@/lib/wizard-context";
import { ProgressHeader } from "@/components/wizard/progress-header";
import { StepStart } from "@/components/wizard/step-start";
import { StepGrunddaten } from "@/components/wizard/step-grunddaten";
import { StepSchwerbehinderung } from "@/components/wizard/step-schwerbehinderung";
import { StepBildung } from "@/components/wizard/step-bildung";
import { StepBeruf } from "@/components/wizard/step-beruf";
import { StepAnlagen } from "@/components/wizard/step-anlagen";
import { StepPruefen } from "@/components/wizard/step-pruefen";
import { StepBestaetigung } from "@/components/wizard/step-bestaetigung";

const SCHRITT_KOMPONENTEN = [
  StepStart,
  StepGrunddaten,
  StepSchwerbehinderung,
  StepBildung,
  StepBeruf,
  StepAnlagen,
  StepPruefen,
  StepBestaetigung,
];

function Wizard() {
  const { state, hydrated } = useWizard();
  const Schritt = SCHRITT_KOMPONENTEN[state.step] ?? StepStart;

  // Bis localStorage gelesen ist, nichts rendern (verhindert Hydration-Flackern)
  if (!hydrated) return <div className="min-h-dvh" />;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Schmale Demo-Leiste, immer sichtbar */}
      <p className="bg-primary py-1.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground/90">
        Klick-Prototyp · EDGE Digital · keine Datenübertragung
      </p>

      <ProgressHeader step={state.step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-1 flex-col"
        >
          <Schritt />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <WizardProvider>
      <Wizard />
    </WizardProvider>
  );
}
