"use client";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

// Unten fixierte Navigation: Daumenzone, große Touch-Ziele.
export function WizardNav({
  onBack,
  nextLabel = "Weiter",
  nextForm,
  onNext,
  senden,
}: {
  onBack?: () => void;
  nextLabel?: string;
  // Formular-ID: der Weiter-Button submitted das Formular des aktuellen Schritts
  nextForm?: string;
  onNext?: () => void;
  senden?: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-border/70 bg-background/90 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-5">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 shrink-0 rounded-xl bg-card px-4 text-base"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Zurück
          </Button>
        )}
        <Button
          type={nextForm ? "submit" : "button"}
          form={nextForm}
          onClick={onNext}
          className="h-12 flex-1 rounded-xl text-base font-medium shadow-lg shadow-primary/20"
        >
          {nextLabel}
          {senden ? <Send className="size-4" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
        </Button>
      </div>
    </div>
  );
}
