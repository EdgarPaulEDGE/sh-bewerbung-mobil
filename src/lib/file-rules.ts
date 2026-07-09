// Die echten Upload-Regeln des Bewerbungsportals, hier client-seitig
// und sofort beim Auswählen geprüft statt erst beim Abschicken.

export const MAX_GESAMT_BYTES = 20 * 1024 * 1024; // 20 MB Gesamtvolumen

// Erlaubt: Buchstaben (inkl. Umlaute), Ziffern, Leerzeichen, Punkt,
// Unterstrich, Bindestrich, Klammern. Alles andere gilt als Sonderzeichen.
const DATEINAME_OK = /^[A-Za-z0-9äöüÄÖÜß_\-. ()]+$/;

export function pruefeDatei(file: File): string | null {
  const istPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!istPdf) {
    return `"${kurz(file.name)}" ist keine PDF-Datei. Das Portal akzeptiert ausschließlich PDF.`;
  }
  if (!DATEINAME_OK.test(file.name)) {
    return `Der Dateiname "${kurz(file.name)}" enthält Sonderzeichen (z. B. &, §, $). Bitte umbenennen.`;
  }
  return null;
}

export function pruefeGesamtvolumen(bisherBytes: number, neuBytes: number): string | null {
  if (bisherBytes + neuBytes > MAX_GESAMT_BYTES) {
    return `Das Gesamtvolumen aller Anlagen darf 20 MB nicht überschreiten (aktuell wären es ${formatBytes(bisherBytes + neuBytes)}).`;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function kurz(name: string): string {
  return name.length > 40 ? name.slice(0, 37) + "…" : name;
}
