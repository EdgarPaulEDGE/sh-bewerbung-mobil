"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Check, Mail, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/lib/wizard-context";

export function StepBestaetigung() {
  const { state, reset } = useWizard();
  const email = state.data.grunddaten?.email;

  // Simuliertes Aktenzeichen, nur fürs Demo-Gefühl
  const aktenzeichen = useMemo(() => {
    const n = Math.floor(100000 + Math.random() * 900000);
    return `SH-2027-${n}`;
  }, []);

  return (
    <main className="wave-wash mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25"
      >
        <Check className="size-10" strokeWidth={2.5} aria-hidden />
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
      >
        <h1 className="mt-7 text-[1.7rem] font-bold leading-tight text-primary">
          Deine Bewerbung ist da!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Vielen Dank für dein Interesse an der Landesverwaltung Schleswig-Holstein.
          Dein simuliertes Aktenzeichen:{" "}
          <span className="font-bold tabular-nums text-foreground">{aktenzeichen}</span>
        </p>

        {email && (
          <p className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-xl bg-secondary/70 px-4 py-3 text-sm text-foreground/80">
            <Mail className="size-4 shrink-0 text-primary" aria-hidden />
            Die Eingangsbestätigung würde an {email} gehen.
          </p>
        )}

        <p className="mx-auto mt-8 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          Dies ist ein Klick-Prototyp von EDGE Digital. Es wurden keine Daten
          übertragen oder gespeichert, außer lokal auf diesem Gerät.
        </p>

        <Button variant="outline" onClick={reset} className="mt-6 h-11 rounded-xl bg-card">
          <RotateCcw className="size-4" aria-hidden />
          Prototyp zurücksetzen
        </Button>
      </motion.div>
    </main>
  );
}
