"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  History,
  Info,
  Save,
  Smartphone,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/lib/wizard-context";

const VORTEILE = [
  { icon: Timer, text: "Dauert nur ca. 8 Minuten" },
  { icon: Save, text: "Speichert automatisch auf deinem Gerät" },
  { icon: Smartphone, text: "Komplett am Smartphone ausfüllbar" },
];

const UNTERLAGEN = ["Lebenslauf als PDF", "Zeugnisse und Urkunden als PDF"];

export function StepStart() {
  const { setStep, draftVorhanden, reset, state } = useWizard();

  // Bei vorhandenem Zwischenstand: zum zuletzt sinnvollen Schritt springen.
  // Grunddaten vorhanden heißt mindestens Schritt 2 usw.
  const fortsetzenBei = state.data.anlagen
    ? 6
    : state.data.beruf
      ? 5
      : state.data.bildung
        ? 4
        : state.data.schwerbehinderung
          ? 3
          : state.data.grunddaten
            ? 2
            : 1;

  return (
    <>
      <main className="wave-wash mx-auto w-full max-w-2xl flex-1 px-5 pb-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Landesverwaltung Schleswig-Holstein
          </p>
          <h1 className="mt-2 text-balance text-[2rem] font-bold leading-[1.12] text-primary">
            Regierungs&shy;inspektor&shy;anwärter/in
          </h1>
          <p className="mt-1.5 text-lg font-light text-muted-foreground">
            Einstellung 2027 · Beamtenlaufbahn, Laufbahngruppe 2
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
            Schön, dass du dich für eine Tätigkeit in der Landesverwaltung
            Schleswig-Holsteins interessierst. Hier bewirbst du dich direkt online.
            Alle Anforderungen an die Stelle findest du im Ausschreibungstext.
          </p>
        </motion.div>

        <motion.ul
          className="mt-8 space-y-3"
          initial="aus"
          animate="an"
          variants={{ an: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } }}
        >
          {VORTEILE.map(({ icon: Icon, text }) => (
            <motion.li
              key={text}
              variants={{ aus: { opacity: 0, x: -12 }, an: { opacity: 1, x: 0 } }}
              className="flex items-center gap-3 text-[15px]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <Icon className="size-4.5" aria-hidden />
              </span>
              {text}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="mt-8 rounded-2xl border border-border bg-card p-5"
        >
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FileText className="size-4 text-primary" aria-hidden />
            Das solltest du bereithalten
          </p>
          <ul className="mt-3 space-y-2">
            {UNTERLAGEN.map((u) => (
              <li key={u} className="flex items-start gap-2.5 text-[15px] text-foreground/85">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary/50" />
                {u}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            Du kannst die Bewerbung jederzeit unterbrechen und später weitermachen.
            Deine Eingaben bleiben auf diesem Gerät gespeichert.
          </p>
        </motion.div>

        {/* Die Inhalte der Original-Willkommensseite, mobil aufbereitet:
            relevante Hinweise aufklappbar, technische Altlasten als erledigt markiert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <details className="group mt-4 rounded-2xl border border-border bg-card">
            <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-3 p-5 py-4 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <Info className="size-4 text-primary" aria-hidden />
                Alle Hinweise zum Bewerbungsverfahren
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="space-y-4 border-t border-border px-5 py-4 text-[14px] leading-relaxed text-foreground/80">
              <p>
                <strong>Nachweise:</strong> Belege deine Angaben mit Schul-,
                Ausbildungs- und Arbeitszeugnissen sowie ggf. aktuellen
                Beurteilungen. Du lädst sie im Schritt „Motivation und Anlagen"
                hoch. Welche Nachweise zusätzlich nötig sind, steht im
                Ausschreibungstext.
              </p>
              <p>
                <strong>Dateiformat:</strong>{" "}Zugelassen sind ausschließlich
                PDF-Dateien, insgesamt maximal 20 MB, ohne Sonderzeichen
                (z. B. &amp;, §, $) im Dateinamen. Die Strecke prüft das
                automatisch beim Auswählen jeder Datei.
              </p>
              <p>
                <strong>Pflichtangaben:</strong> Pflichtfelder erkennst du am
                roten Punkt <span aria-hidden className="inline-block size-1.5 rounded-full bg-shred/80" />{" "}
                neben der Bezeichnung. Alle weiteren Angaben sind freiwillig.
              </p>
              <p>
                <strong>Nach dem Absenden:</strong> Du erhältst automatisch eine
                Eingangsbestätigung an deine E-Mail-Adresse. Weitere Mitteilungen
                zum Verfahren kommen per E-Mail und ggf. auf dem Postweg.
              </p>
              <p>
                <strong>Rückfragen:</strong> Bei Fragen und technischen Problemen
                hilft dir die im Ausschreibungstext angegebene Kontaktadresse.
              </p>
              <div className="rounded-xl bg-secondary/60 p-3.5">
                <p className="mb-2 text-[13px] font-bold text-primary">
                  Darum musst du dich nicht mehr kümmern
                </p>
                <ul className="space-y-1.5 text-[13px] text-foreground/75">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                    Kein Zeitlimit: deine Eingaben werden automatisch gespeichert
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                    Mehrfacheinträge einfach über „Hinzufügen", ohne Tabellensymbole
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                    Dateiregeln werden sofort beim Hochladen geprüft, nicht erst am Ende
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </motion.div>

        {draftVorhanden && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-2xl border border-primary/25 bg-secondary/60 p-5"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-primary">
              <History className="size-4" aria-hidden />
              Begonnene Bewerbung gefunden
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
              Deine bisherigen Eingaben sind noch da. Du kannst direkt weitermachen.
            </p>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => setStep(fortsetzenBei)} className="h-11 flex-1 rounded-xl">
                Weitermachen
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                className="h-11 rounded-xl bg-card"
              >
                Neu starten
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {!draftVorhanden && (
        <div className="sticky bottom-0 z-20 bg-background/90 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 backdrop-blur-md">
          <div className="mx-auto w-full max-w-2xl px-5">
            <Button
              onClick={() => setStep(1)}
              className="h-13 w-full rounded-xl text-base font-medium shadow-lg shadow-primary/25"
            >
              Bewerbung starten
              <ArrowRight className="size-4.5" aria-hidden />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
