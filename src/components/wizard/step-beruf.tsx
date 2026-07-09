"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field } from "./field";
import { WizardNav } from "./wizard-nav";
import { EintragCard, HinzufuegenButton } from "./eintrag-liste";
import { useWizard } from "@/lib/wizard-context";
import { berufSchema, type Beruf } from "@/lib/schema";

const eingabe = "h-11 rounded-lg bg-background px-3 text-base";

export function StepBeruf() {
  const { state, saveStep, setStep } = useWizard();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Beruf>({
    resolver: zodResolver(berufSchema),
    defaultValues: state.data.beruf ?? { eintraege: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "eintraege" });

  const onValid = (values: Beruf) => {
    saveStep("beruf", values);
    setStep(5);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <p className="mb-6 text-[15px] leading-relaxed text-muted-foreground">
          Falls du schon gearbeitet hast: Ausbildung, Jobs und Praktika gehören
          hierher. Du kommst direkt von der Schule? Dann kannst du diesen Schritt
          einfach überspringen.
        </p>

        <form id="form-beruf" onSubmit={handleSubmit(onValid)} className="space-y-4" noValidate>
          {fields.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
                <Briefcase className="size-5" aria-hidden />
              </span>
              <p className="text-[15px] text-muted-foreground">
                Noch keine beruflichen Stationen. Das ist völlig in Ordnung.
              </p>
            </div>
          )}

          {fields.map((feld, i) => (
            <EintragCard
              key={feld.id}
              titel={`Tätigkeit ${i + 1}`}
              entfernbar
              onRemove={() => remove(i)}
            >
              <Field
                label="Berufsbezeichnung"
                htmlFor={`beruf-bezeichnung-${i}`}
                required
                error={errors.eintraege?.[i]?.berufsbezeichnung?.message}
              >
                <Input
                  id={`beruf-bezeichnung-${i}`}
                  placeholder="z. B. Kauffrau für Büromanagement"
                  className={eingabe}
                  {...register(`eintraege.${i}.berufsbezeichnung`)}
                />
              </Field>
              <Field
                label="Firma bzw. Behörde"
                htmlFor={`beruf-firma-${i}`}
                required
                error={errors.eintraege?.[i]?.firma?.message}
              >
                <Input id={`beruf-firma-${i}`} className={eingabe} {...register(`eintraege.${i}.firma`)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Beginn"
                  htmlFor={`beruf-beginn-${i}`}
                  required
                  error={errors.eintraege?.[i]?.beginn?.message}
                >
                  <Input
                    id={`beruf-beginn-${i}`}
                    type="month"
                    className={eingabe}
                    {...register(`eintraege.${i}.beginn`)}
                  />
                </Field>
                <Field
                  label="Ende"
                  htmlFor={`beruf-ende-${i}`}
                  hint="Leer lassen, wenn aktuell"
                  error={errors.eintraege?.[i]?.ende?.message}
                >
                  <Input
                    id={`beruf-ende-${i}`}
                    type="month"
                    className={eingabe}
                    {...register(`eintraege.${i}.ende`)}
                  />
                </Field>
              </div>
            </EintragCard>
          ))}

          <HinzufuegenButton
            label="Tätigkeit hinzufügen"
            onClick={() => append({ beginn: "", ende: "", berufsbezeichnung: "", firma: "" })}
          />
        </form>
      </main>
      <WizardNav onBack={() => setStep(3)} nextForm="form-beruf" />
    </>
  );
}
