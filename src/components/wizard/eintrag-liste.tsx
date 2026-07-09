"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mobile Alternative zur Desktop-Tabelle des Originalportals:
// wiederholbare Einträge als Cards mit großem Hinzufügen-Button,
// statt Plus/Haken/Minus-Icons in einem Tabellenkopf.
export function EintragCard({
  titel,
  onRemove,
  entfernbar,
  children,
}: {
  titel: string;
  onRemove: () => void;
  entfernbar: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-primary">{titel}</p>
        {entfernbar && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label={`${titel} entfernen`}
            className="size-9 rounded-lg text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

export function HinzufuegenButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 text-[15px] font-medium text-primary transition-colors hover:border-primary/60 hover:bg-secondary/50"
    >
      <Plus className="size-4.5" aria-hidden />
      {label}
    </button>
  );
}
