"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Einheitlicher Rahmen für jedes Formularfeld: Label, Eingabe, Fehlertext.
// Pflichtfelder bekommen einen dezenten roten Punkt statt des kryptischen Sternchens.
export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="gap-1 text-[13px] font-medium text-foreground/80">
        {label}
        {required && (
          <span aria-hidden className="mt-[3px] inline-block size-1.5 rounded-full bg-shred/80" />
        )}
      </Label>
      {children}
      {hint && !error && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-[13px] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
