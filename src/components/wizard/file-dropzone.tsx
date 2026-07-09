"use client";

import { useRef, useState } from "react";
import { AlertTriangle, FileCheck2, RefreshCw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizard, type AnlageKind } from "@/lib/wizard-context";
import { formatBytes, pruefeDatei, pruefeGesamtvolumen } from "@/lib/file-rules";
import { cn } from "@/lib/utils";

// Upload-Bereich pro Dokumenttyp. Prüft die echten Portal-Regeln
// (nur PDF, 20 MB gesamt, keine Sonderzeichen) sofort beim Auswählen.
export function FileDropzone({
  kind,
  titel,
  beschreibung,
  multiple,
}: {
  kind: AnlageKind;
  titel: string;
  beschreibung: string;
  multiple?: boolean;
}) {
  const { state, gesamtBytes, addAnlage, removeAnlage } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  const eintraege = state.anlagen.filter((a) => a.kind === kind);
  const voll = !multiple && eintraege.length >= 1;

  const dateienVerarbeiten = (files: FileList | null) => {
    if (!files) return;
    setFehler(null);
    let laufendeBytes = gesamtBytes;
    for (const file of Array.from(files)) {
      const einzelFehler = pruefeDatei(file);
      if (einzelFehler) {
        setFehler(einzelFehler);
        continue;
      }
      const volumenFehler = pruefeGesamtvolumen(laufendeBytes, file.size);
      if (volumenFehler) {
        setFehler(volumenFehler);
        break;
      }
      laufendeBytes += file.size;
      addAnlage(kind, file);
      if (!multiple) break;
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[15px] font-bold">{titel}</p>
        <p className="text-[13px] text-muted-foreground">{beschreibung}</p>
      </div>

      {eintraege.map((a) => (
        <div
          key={a.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border bg-card p-3",
            a.attached ? "border-border" : "border-amber-300 bg-amber-50"
          )}
        >
          {a.attached ? (
            <FileCheck2 className="size-5 shrink-0 text-primary" aria-hidden />
          ) : (
            <RefreshCw className="size-5 shrink-0 text-amber-600" aria-hidden />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{a.name}</p>
            <p className="text-xs text-muted-foreground">
              {a.attached
                ? formatBytes(a.size)
                : "Nach dem Gerätewechsel bitte erneut anhängen"}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`${a.name} entfernen`}
            onClick={() => removeAnlage(a.id)}
            className="size-9 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      ))}

      {!voll && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-primary/30 text-[15px] font-medium text-primary transition-colors hover:border-primary/60 hover:bg-secondary/50"
        >
          <Upload className="size-4.5" aria-hidden />
          PDF auswählen
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple={multiple}
        className="sr-only"
        aria-label={`${titel} hochladen`}
        onChange={(e) => dateienVerarbeiten(e.target.files)}
      />

      {fehler && (
        <p role="alert" className="flex items-start gap-2 text-[13px] font-medium text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {fehler}
        </p>
      )}
    </div>
  );
}
