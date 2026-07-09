"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Field } from "./field";
import { WizardNav } from "./wizard-nav";
import { EintragCard, HinzufuegenButton } from "./eintrag-liste";
import { useWizard } from "@/lib/wizard-context";
import { SCHULABSCHLUESSE, bildungSchema, type Bildung } from "@/lib/schema";

const eingabe = "h-11 rounded-lg bg-background px-3 text-base";

export function StepBildung() {
  const { state, saveStep, setStep } = useWizard();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Bildung>({
    resolver: zodResolver(bildungSchema),
    defaultValues: state.data.bildung ?? {
      eintraege: [{ beginn: "", ende: "", abschluss: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "eintraege" });

  const onValid = (values: Bildung) => {
    saveStep("bildung", values);
    setStep(4);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <p className="mb-6 text-[15px] leading-relaxed text-muted-foreground">
          Trage bitte deinen höchsten Schulabschluss ein, ggf. auch Berufsschule
          und Studium. Weitere Stationen kannst du einfach hinzufügen.
        </p>

        <form id="form-bildung" onSubmit={handleSubmit(onValid)} className="space-y-4" noValidate>
          {fields.map((feld, i) => (
            <EintragCard
              key={feld.id}
              titel={`Station ${i + 1}`}
              entfernbar={fields.length > 1}
              onRemove={() => remove(i)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Beginn"
                  htmlFor={`bildung-beginn-${i}`}
                  required
                  error={errors.eintraege?.[i]?.beginn?.message}
                >
                  <Input
                    id={`bildung-beginn-${i}`}
                    type="month"
                    className={eingabe}
                    {...register(`eintraege.${i}.beginn`)}
                  />
                </Field>
                <Field
                  label="Ende"
                  htmlFor={`bildung-ende-${i}`}
                  required
                  error={errors.eintraege?.[i]?.ende?.message}
                >
                  <Input
                    id={`bildung-ende-${i}`}
                    type="month"
                    className={eingabe}
                    {...register(`eintraege.${i}.ende`)}
                  />
                </Field>
              </div>
              <Field
                label="Abschluss"
                htmlFor={`bildung-abschluss-${i}`}
                required
                error={errors.eintraege?.[i]?.abschluss?.message}
              >
                <SelectNative
                  id={`bildung-abschluss-${i}`}
                  className="bg-background"
                  aria-invalid={!!errors.eintraege?.[i]?.abschluss}
                  {...register(`eintraege.${i}.abschluss`)}
                >
                  <option value="">Bitte wählen</option>
                  {SCHULABSCHLUESSE.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </SelectNative>
              </Field>
            </EintragCard>
          ))}

          <HinzufuegenButton
            label="Weitere Station hinzufügen"
            onClick={() => append({ beginn: "", ende: "", abschluss: "" })}
          />
          {errors.eintraege?.root?.message && (
            <p role="alert" className="text-[13px] font-medium text-destructive">
              {errors.eintraege.root.message}
            </p>
          )}
        </form>
      </main>
      <WizardNav onBack={() => setStep(2)} nextForm="form-bildung" />
    </>
  );
}
