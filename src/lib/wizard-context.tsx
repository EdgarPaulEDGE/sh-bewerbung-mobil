"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { WizardData } from "./schema";

export const SCHRITTE = [
  "start",
  "grunddaten",
  "schwerbehinderung",
  "bildung",
  "beruf",
  "anlagen",
  "pruefen",
  "bestaetigung",
] as const;

export type SchrittName = (typeof SCHRITTE)[number];

// Schritte 1 bis 6 zählen für die Fortschrittsanzeige (Start und Bestätigung nicht)
export const FORMULAR_SCHRITTE = 6;

export type AnlageKind = "lebenslauf" | "zeugnisse" | "weitere";

export type AnlageMeta = {
  id: string;
  name: string;
  size: number;
  kind: AnlageKind;
  // false nach einem Reload: Metadaten sind da, die Datei selbst muss neu angehängt werden
  attached: boolean;
};

type WizardState = {
  step: number;
  data: WizardData;
  anlagen: AnlageMeta[];
  submitted: boolean;
};

const LEER: WizardState = { step: 0, data: {}, anlagen: [], submitted: false };
const STORAGE_KEY = "sh-bewerbung-prototyp";

// File-Objekte lassen sich nicht in localStorage speichern.
// Sie leben nur im Speicher, persistiert werden nur die Metadaten.
const fileStore = new Map<string, File>();

type WizardContextType = {
  state: WizardState;
  hydrated: boolean;
  draftVorhanden: boolean;
  gesamtBytes: number;
  setStep: (step: number) => void;
  saveStep: <K extends keyof WizardData>(key: K, values: WizardData[K]) => void;
  addAnlage: (kind: AnlageKind, file: File) => string;
  removeAnlage: (id: string) => void;
  submit: () => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(LEER);
  const [hydrated, setHydrated] = useState(false);
  const [draftVorhanden, setDraftVorhanden] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Beim Start: gespeicherten Zwischenstand laden, aber auf der Startseite bleiben.
  // Das Fortsetzen übernimmt der Resume-Banner.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as WizardState;
        if (saved.step > 0 && !saved.submitted) {
          setState({
            ...saved,
            step: 0,
            anlagen: saved.anlagen.map((a) => ({ ...a, attached: false })),
          });
          setDraftVorhanden(true);
        }
      }
    } catch {
      // defekter Speicherstand wird ignoriert
    }
    setHydrated(true);
  }, []);

  // Auto-Save: jede Änderung landet debounced im localStorage
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Speicher voll: Prototyp ignoriert das bewusst
      }
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated]);

  const setStep = useCallback((step: number) => {
    setState((s) => ({ ...s, step }));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const saveStep = useCallback(
    <K extends keyof WizardData>(key: K, values: WizardData[K]) => {
      setState((s) => ({ ...s, data: { ...s.data, [key]: values } }));
    },
    []
  );

  const addAnlage = useCallback((kind: AnlageKind, file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    fileStore.set(id, file);
    setState((s) => ({
      ...s,
      anlagen: [...s.anlagen, { id, name: file.name, size: file.size, kind, attached: true }],
    }));
    return id;
  }, []);

  const removeAnlage = useCallback((id: string) => {
    fileStore.delete(id);
    setState((s) => ({ ...s, anlagen: s.anlagen.filter((a) => a.id !== id) }));
  }, []);

  const submit = useCallback(() => {
    setState((s) => ({ ...s, submitted: true, step: SCHRITTE.length - 1 }));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const reset = useCallback(() => {
    fileStore.clear();
    localStorage.removeItem(STORAGE_KEY);
    setDraftVorhanden(false);
    setState(LEER);
  }, []);

  const gesamtBytes = useMemo(
    () => state.anlagen.filter((a) => a.attached).reduce((sum, a) => sum + a.size, 0),
    [state.anlagen]
  );

  const value = useMemo(
    () => ({
      state,
      hydrated,
      draftVorhanden,
      gesamtBytes,
      setStep,
      saveStep,
      addAnlage,
      removeAnlage,
      submit,
      reset,
    }),
    [state, hydrated, draftVorhanden, gesamtBytes, setStep, saveStep, addAnlage, removeAnlage, submit, reset]
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard muss innerhalb von WizardProvider verwendet werden");
  return ctx;
}
