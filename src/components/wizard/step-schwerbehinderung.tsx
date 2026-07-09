"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Accessibility, Check } from "lucide-react";
import { SelectNative } from "@/components/ui/select-native";
import { Field } from "./field";
import { WizardNav } from "./wizard-nav";
import { useWizard } from "@/lib/wizard-context";
import { schwerbehinderungSchema, type Schwerbehinderung } from "@/lib/schema";
import { cn } from "@/lib/utils";

const OPTIONEN: { wert: Schwerbehinderung["status"]; beschreibung: string }[] = [
  {
    wert: "keine Angabe",
    beschreibung: "Ich möchte hierzu nichts angeben.",
  },
  {
    wert: "Schwerbehinderung",
    beschreibung: "Es liegt eine anerkannte Schwerbehinderung vor (GdB 50 oder mehr).",
  },
  {
    wert: "Gleichstellung",
    beschreibung: "Ich bin schwerbehinderten Menschen gleichgestellt (§ 2 Abs. 3 SGB IX).",
  },
];

const GDB_WERTE = ["50", "60", "70", "80", "90", "100"];

export function StepSchwerbehinderung() {
  const { state, saveStep, setStep } = useWizard();

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Schwerbehinderung>({
    resolver: zodResolver(schwerbehinderungSchema),
    defaultValues: state.data.schwerbehinderung ?? { status: "keine Angabe", gdb: "" },
  });

  const status = watch("status");

  const onValid = (values: Schwerbehinderung) => {
    saveStep("schwerbehinderung", values);
    setStep(3);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed text-foreground/80">
          <Accessibility className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p>
            Diese Angabe ist freiwillig. Schwerbehinderte und gleichgestellte Menschen
            werden bei gleicher Eignung bevorzugt berücksichtigt.
          </p>
        </div>

        <form id="form-schwerbehinderung" onSubmit={handleSubmit(onValid)} className="space-y-6" noValidate>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div role="radiogroup" aria-label="Schwerbehinderung" className="space-y-3">
                {OPTIONEN.map((o) => {
                  const aktiv = field.value === o.wert;
                  return (
                    <button
                      key={o.wert}
                      type="button"
                      role="radio"
                      aria-checked={aktiv}
                      onClick={() => field.onChange(o.wert)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-all",
                        aktiv
                          ? "border-primary ring-3 ring-primary/15"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                          aktiv ? "border-primary bg-primary text-primary-foreground" : "border-input"
                        )}
                      >
                        {aktiv && <Check className="size-3.5" aria-hidden />}
                      </span>
                      <span>
                        <span className="block text-[15px] font-bold">{o.wert}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                          {o.beschreibung}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />

          {status === "Schwerbehinderung" && (
            <Field
              label="Grad der Behinderung (GdB)"
              htmlFor="gdb"
              required
              error={errors.gdb?.message}
              hint="Den Nachweis kannst du später im Schritt Anlagen hochladen."
            >
              <SelectNative id="gdb" aria-invalid={!!errors.gdb} {...register("gdb")}>
                <option value="">Bitte wählen</option>
                {GDB_WERTE.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </SelectNative>
            </Field>
          )}
        </form>
      </main>
      <WizardNav onBack={() => setStep(1)} nextForm="form-schwerbehinderung" />
    </>
  );
}
