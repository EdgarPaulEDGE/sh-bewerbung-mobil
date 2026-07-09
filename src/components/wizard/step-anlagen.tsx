"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { Separator } from "@/components/ui/separator";
import { Field } from "./field";
import { WizardNav } from "./wizard-nav";
import { FileDropzone } from "./file-dropzone";
import { useWizard } from "@/lib/wizard-context";
import { QUELLEN, anlagenSchema, type Anlagen } from "@/lib/schema";
import { MAX_GESAMT_BYTES, formatBytes } from "@/lib/file-rules";

export function StepAnlagen() {
  const { state, gesamtBytes, saveStep, setStep } = useWizard();
  const [anlagenFehler, setAnlagenFehler] = useState<string | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Anlagen>({
    resolver: zodResolver(anlagenSchema),
    defaultValues: state.data.anlagen ?? { motivation: "", quelle: "" },
  });

  const motivation = watch("motivation") ?? "";
  const volumenProzent = Math.min(100, (gesamtBytes / MAX_GESAMT_BYTES) * 100);

  const onValid = (values: Anlagen) => {
    // Lebenslauf ist Pflicht, wie im Original-Portal
    const hatLebenslauf = state.anlagen.some((a) => a.kind === "lebenslauf");
    if (!hatLebenslauf) {
      setAnlagenFehler("Bitte lade deinen Lebenslauf als PDF hoch.");
      return;
    }
    setAnlagenFehler(null);
    saveStep("anlagen", values);
    setStep(6);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <form id="form-anlagen" onSubmit={handleSubmit(onValid)} className="space-y-7" noValidate>
          <Field
            label="Warum möchtest du zur Landesverwaltung?"
            htmlFor="motivation"
            required
            error={errors.motivation?.message}
          >
            <Textarea
              id="motivation"
              rows={6}
              placeholder="Erzähl kurz, was dich an der Ausbildung und der Arbeit für Schleswig-Holstein reizt …"
              aria-invalid={!!errors.motivation}
              className="min-h-36 rounded-xl bg-card px-3 py-2.5 text-base leading-relaxed"
              {...register("motivation")}
            />
            <p className="text-right text-xs tabular-nums text-muted-foreground">
              {motivation.length} Zeichen
            </p>
          </Field>

          <Field
            label="Wie bist du auf diese Ausschreibung aufmerksam geworden?"
            htmlFor="quelle"
            required
            error={errors.quelle?.message}
          >
            <SelectNative id="quelle" aria-invalid={!!errors.quelle} {...register("quelle")}>
              <option value="">Bitte wählen</option>
              {QUELLEN.map((q) => (
                <option key={q}>{q}</option>
              ))}
            </SelectNative>
          </Field>

          <Separator />

          <div className="space-y-6">
            <FileDropzone
              kind="lebenslauf"
              titel="Lebenslauf"
              beschreibung="Eine PDF-Datei"
            />
            <FileDropzone
              kind="zeugnisse"
              titel="Zeugnisse und Urkunden"
              beschreibung="Mehrere PDF-Dateien möglich, z. B. Schulzeugnisse"
              multiple
            />
            <FileDropzone
              kind="weitere"
              titel="Weitere Nachweise (optional)"
              beschreibung="z. B. Schwerbehindertenausweis, Praktikumsnachweise"
              multiple
            />
          </div>

          {/* Volumen-Anzeige: die 20-MB-Grenze des Portals, hier live sichtbar */}
          <div className="rounded-xl bg-muted/70 p-4">
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="font-medium text-foreground/75">Gesamtvolumen</span>
              <span className="tabular-nums text-muted-foreground">
                {formatBytes(gesamtBytes)} von 20 MB
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${volumenProzent}%` }}
              />
            </div>
          </div>

          {anlagenFehler && (
            <p role="alert" className="text-[13px] font-medium text-destructive">
              {anlagenFehler}
            </p>
          )}
        </form>
      </main>
      <WizardNav onBack={() => setStep(4)} nextForm="form-anlagen" />
    </>
  );
}
