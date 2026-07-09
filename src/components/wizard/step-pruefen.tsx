"use client";

import { useState } from "react";
import { PencilLine, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WizardNav } from "./wizard-nav";
import { useWizard } from "@/lib/wizard-context";
import { formatBytes } from "@/lib/file-rules";

function Block({
  titel,
  aufSchritt,
  children,
}: {
  titel: string;
  aufSchritt: number;
  children: React.ReactNode;
}) {
  const { setStep } = useWizard();
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-primary">{titel}</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep(aufSchritt)}
          className="h-8 gap-1.5 rounded-lg px-2.5 text-[13px] text-muted-foreground"
        >
          <PencilLine className="size-3.5" aria-hidden />
          Bearbeiten
        </Button>
      </div>
      <div className="space-y-1.5 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

function Zeile({ label, wert }: { label: string; wert?: string }) {
  if (!wert) return null;
  return (
    <p className="flex justify-between gap-4">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{wert}</span>
    </p>
  );
}

export function StepPruefen() {
  const { state, setStep, submit } = useWizard();
  const [einwilligungEmail, setEinwilligungEmail] = useState(false);
  const [datenschutz, setDatenschutz] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const g = state.data.grunddaten;
  const s = state.data.schwerbehinderung;
  const b = state.data.bildung;
  const be = state.data.beruf;
  const a = state.data.anlagen;

  const absenden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!einwilligungEmail || !datenschutz) {
      setFehler("Bitte bestätige beide Erklärungen, dann kann die Bewerbung abgeschickt werden.");
      return;
    }
    setFehler(null);
    submit();
  };

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
          Fast geschafft. Prüfe deine Angaben in Ruhe, du kannst jeden Bereich
          noch einmal bearbeiten.
        </p>

        <form id="form-pruefen" onSubmit={absenden} className="space-y-4" noValidate>
          <Block titel="Grunddaten" aufSchritt={1}>
            <Zeile label="Name" wert={[g?.titel, g?.vorname, g?.nachname].filter(Boolean).join(" ")} />
            <Zeile label="Geboren" wert={g && `${formatDatum(g.geburtsdatum)} in ${g.geburtsort}`} />
            <Zeile label="Anschrift" wert={g && `${g.strasse} ${g.hausnummer}, ${g.plz} ${g.wohnort}`} />
            <Zeile label="E-Mail" wert={g?.email} />
            <Zeile label="Mobil" wert={g?.telefonMobil} />
          </Block>

          <Block titel="Schwerbehinderung" aufSchritt={2}>
            <Zeile
              label="Angabe"
              wert={s?.status === "Schwerbehinderung" ? `Schwerbehinderung (GdB ${s.gdb})` : s?.status}
            />
          </Block>

          <Block titel="Schule und Studium" aufSchritt={3}>
            {b?.eintraege.map((e2, i) => (
              <Zeile key={i} label={`${formatMonat(e2.beginn)} bis ${formatMonat(e2.ende)}`} wert={e2.abschluss} />
            ))}
          </Block>

          <Block titel="Beruflicher Werdegang" aufSchritt={4}>
            {be?.eintraege.length ? (
              be.eintraege.map((e2, i) => (
                <Zeile
                  key={i}
                  label={`${formatMonat(e2.beginn)} bis ${e2.ende ? formatMonat(e2.ende) : "heute"}`}
                  wert={`${e2.berufsbezeichnung}, ${e2.firma}`}
                />
              ))
            ) : (
              <p className="text-muted-foreground">Keine Angaben</p>
            )}
          </Block>

          <Block titel="Motivation und Anlagen" aufSchritt={5}>
            {a?.motivation && (
              <p className="line-clamp-3 text-[14px] italic leading-relaxed text-foreground/75">
                „{a.motivation}“
              </p>
            )}
            <div className="pt-1">
              {state.anlagen.map((datei) => (
                <Zeile key={datei.id} label={datei.name} wert={formatBytes(datei.size)} />
              ))}
            </div>
          </Block>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-[14px] leading-snug">
              <Checkbox
                className="mt-0.5"
                checked={einwilligungEmail}
                onCheckedChange={(c) => setEinwilligungEmail(c === true)}
              />
              Verfahrenshinweise und Fragen des Landes Schleswig-Holstein dürfen mir
              per E-Mail zugestellt werden.
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-[14px] leading-snug">
              <Checkbox
                className="mt-0.5"
                checked={datenschutz}
                onCheckedChange={(c) => setDatenschutz(c === true)}
              />
              <span>
                Ich habe den{" "}
                <span className="font-medium text-primary underline underline-offset-2">
                  Datenschutzhinweis
                </span>{" "}
                zur Verarbeitung meiner personenbezogenen Daten im Auswahlverfahren
                zur Kenntnis genommen.
              </span>
            </label>
            {fehler && (
              <p role="alert" className="text-[13px] font-medium text-destructive">
                {fehler}
              </p>
            )}
          </div>

          {/* Im Original: Captcha-Bild mit Zeichenfolge. Moderner Bot-Schutz braucht keine Nutzeraktion. */}
          <p className="flex items-center gap-2 pt-1 text-[13px] text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-primary/60" aria-hidden />
            Der Schutz vor automatisierten Eingaben läuft unsichtbar im Hintergrund.
          </p>
        </form>
      </main>
      <WizardNav onBack={() => setStep(5)} nextForm="form-pruefen" nextLabel="Bewerbung absenden" senden />
    </>
  );
}

function formatDatum(iso?: string): string {
  if (!iso) return "";
  const [j, m, t] = iso.split("-");
  return t && m && j ? `${t}.${m}.${j}` : iso;
}

function formatMonat(iso?: string): string {
  if (!iso) return "";
  const [j, m] = iso.split("-");
  return m && j ? `${m}/${j}` : iso;
}
