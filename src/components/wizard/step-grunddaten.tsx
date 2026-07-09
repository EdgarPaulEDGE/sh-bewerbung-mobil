"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectNative } from "@/components/ui/select-native";
import { Field } from "./field";
import { WizardNav } from "./wizard-nav";
import { useWizard } from "@/lib/wizard-context";
import {
  BUNDESLAENDER,
  FAMILIENSTAND,
  GEBURTSLAND,
  GESCHLECHT,
  KREISE_SH,
  STAATSANGEHOERIGKEIT,
  TITEL,
  grunddatenSchema,
  type Grunddaten,
} from "@/lib/schema";

const eingabe = "h-11 rounded-lg bg-card px-3 text-base";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-border pb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-primary/70">
        {titel}
      </h2>
      {children}
    </section>
  );
}

export function StepGrunddaten() {
  const { state, saveStep, setStep } = useWizard();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Grunddaten>({
    resolver: zodResolver(grunddatenSchema),
    defaultValues: state.data.grunddaten ?? {
      titel: "",
      nachname: "",
      vorname: "",
      weitereVornamen: "",
      email: "",
      geburtsdatum: "",
      geburtsort: "",
      geschlecht: "",
      familienstand: "",
      strasse: "",
      hausnummer: "",
      plz: "",
      wohnort: "",
      bundesland: "",
      kreisStadtSH: "",
      geburtsname: "",
      geburtsland: "",
      staatsangehoerigkeit: "",
      telefonMobil: "",
      telefonPrivat: "",
      eingliederungsschein: false,
    },
  });

  const onValid = (values: Grunddaten) => {
    saveStep("grunddaten", values);
    setStep(2);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <form id="form-grunddaten" onSubmit={handleSubmit(onValid)} className="space-y-8" noValidate>
          <Abschnitt titel="Zu deiner Person">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vorname" htmlFor="vorname" required error={errors.vorname?.message}>
                <Input id="vorname" autoComplete="given-name" className={eingabe} {...register("vorname")} />
              </Field>
              <Field label="Nachname" htmlFor="nachname" required error={errors.nachname?.message}>
                <Input id="nachname" autoComplete="family-name" className={eingabe} {...register("nachname")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Titel" htmlFor="titel" error={errors.titel?.message}>
                <SelectNative id="titel" {...register("titel")}>
                  <option value="">Kein Titel</option>
                  {TITEL.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </SelectNative>
              </Field>
              <Field label="Weitere Vornamen" htmlFor="weitereVornamen">
                <Input id="weitereVornamen" className={eingabe} {...register("weitereVornamen")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Geburtsdatum" htmlFor="geburtsdatum" required error={errors.geburtsdatum?.message}>
                <Input id="geburtsdatum" type="date" autoComplete="bday" className={eingabe} {...register("geburtsdatum")} />
              </Field>
              <Field label="Geburtsort" htmlFor="geburtsort" required error={errors.geburtsort?.message}>
                <Input id="geburtsort" className={eingabe} {...register("geburtsort")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Geschlecht" htmlFor="geschlecht" required error={errors.geschlecht?.message}>
                <SelectNative id="geschlecht" aria-invalid={!!errors.geschlecht} {...register("geschlecht")}>
                  <option value="">Bitte wählen</option>
                  {GESCHLECHT.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </SelectNative>
              </Field>
              <Field label="Familienstand" htmlFor="familienstand" required error={errors.familienstand?.message}>
                <SelectNative id="familienstand" aria-invalid={!!errors.familienstand} {...register("familienstand")}>
                  <option value="">Bitte wählen</option>
                  {FAMILIENSTAND.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </SelectNative>
              </Field>
            </div>
            <Field label="Geburtsname (falls abweichend)" htmlFor="geburtsname">
              <Input id="geburtsname" className={eingabe} {...register("geburtsname")} />
            </Field>
          </Abschnitt>

          <Abschnitt titel="So erreichen wir dich">
            <Field
              label="E-Mail-Adresse"
              htmlFor="email"
              required
              error={errors.email?.message}
              hint="An diese Adresse senden wir die Eingangsbestätigung."
            >
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={eingabe}
                {...register("email")}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mobilnummer" htmlFor="telefonMobil" required error={errors.telefonMobil?.message}>
                <Input
                  id="telefonMobil"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0151 2345678"
                  className={eingabe}
                  {...register("telefonMobil")}
                />
              </Field>
              <Field label="Festnetz (optional)" htmlFor="telefonPrivat">
                <Input id="telefonPrivat" type="tel" inputMode="tel" className={eingabe} {...register("telefonPrivat")} />
              </Field>
            </div>
          </Abschnitt>

          <Abschnitt titel="Deine Anschrift">
            <div className="grid grid-cols-[1fr_88px] gap-3">
              <Field label="Straße" htmlFor="strasse" required error={errors.strasse?.message}>
                <Input id="strasse" autoComplete="address-line1" className={eingabe} {...register("strasse")} />
              </Field>
              <Field label="Nr." htmlFor="hausnummer" required error={errors.hausnummer?.message}>
                <Input id="hausnummer" className={eingabe} {...register("hausnummer")} />
              </Field>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <Field label="PLZ" htmlFor="plz" required error={errors.plz?.message}>
                <Input id="plz" inputMode="numeric" autoComplete="postal-code" className={eingabe} {...register("plz")} />
              </Field>
              <Field label="Wohnort" htmlFor="wohnort" required error={errors.wohnort?.message}>
                <Input id="wohnort" autoComplete="address-level2" className={eingabe} {...register("wohnort")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bundesland" htmlFor="bundesland" required error={errors.bundesland?.message}>
                <SelectNative id="bundesland" aria-invalid={!!errors.bundesland} {...register("bundesland")}>
                  <option value="">Bitte wählen</option>
                  {BUNDESLAENDER.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </SelectNative>
              </Field>
              <Field label="Kreis/Stadt in SH" htmlFor="kreisStadtSH">
                <SelectNative id="kreisStadtSH" {...register("kreisStadtSH")}>
                  <option value="">Keine Angabe</option>
                  {KREISE_SH.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </SelectNative>
              </Field>
            </div>
          </Abschnitt>

          <Abschnitt titel="Herkunft und Staatsangehörigkeit">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Geburtsland" htmlFor="geburtsland" required error={errors.geburtsland?.message}>
                <SelectNative id="geburtsland" aria-invalid={!!errors.geburtsland} {...register("geburtsland")}>
                  <option value="">Bitte wählen</option>
                  {GEBURTSLAND.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </SelectNative>
              </Field>
              <Field
                label="Staatsangehörigkeit"
                htmlFor="staatsangehoerigkeit"
                required
                error={errors.staatsangehoerigkeit?.message}
              >
                <SelectNative
                  id="staatsangehoerigkeit"
                  aria-invalid={!!errors.staatsangehoerigkeit}
                  {...register("staatsangehoerigkeit")}
                >
                  <option value="">Bitte wählen</option>
                  {STAATSANGEHOERIGKEIT.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </SelectNative>
              </Field>
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-[15px] leading-snug">
              <Controller
                name="eingliederungsschein"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="mt-0.5"
                    checked={field.value ?? false}
                    onCheckedChange={(c) => field.onChange(c === true)}
                  />
                )}
              />
              Ich besitze einen Eingliederungsschein bzw. Zulassungsschein (§ 10 SVG)
            </label>
          </Abschnitt>
        </form>
      </main>
      <WizardNav onBack={() => setStep(0)} nextForm="form-grunddaten" />
    </>
  );
}
