import { z } from "zod";

// Feld-Optionen, übernommen aus der Original-Bewerbungsstrecke des Portals

export const TITEL = ["Dr.", "Prof.", "Prof. Dr."] as const;

export const GESCHLECHT = ["weiblich", "männlich", "divers", "keine Angabe"] as const;

export const FAMILIENSTAND = [
  "ledig",
  "verheiratet",
  "eingetragene Lebenspartnerschaft",
  "geschieden",
  "verwitwet",
] as const;

export const BUNDESLAENDER = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
] as const;

export const KREISE_SH = [
  "Dithmarschen",
  "Flensburg (Stadt)",
  "Herzogtum Lauenburg",
  "Kiel (Stadt)",
  "Lübeck (Stadt)",
  "Neumünster (Stadt)",
  "Nordfriesland",
  "Ostholstein",
  "Pinneberg",
  "Plön",
  "Rendsburg-Eckernförde",
  "Schleswig-Flensburg",
  "Segeberg",
  "Steinburg",
  "Stormarn",
] as const;

export const GEBURTSLAND = ["Deutschland", "EU-Mitgliedstaat", "anderes Land"] as const;

export const STAATSANGEHOERIGKEIT = [
  "deutsch",
  "EU-Mitgliedstaat",
  "andere Staatsangehörigkeit",
] as const;

export const SCHULABSCHLUESSE = [
  "Erster allgemeinbildender Schulabschluss (ESA)",
  "Mittlerer Schulabschluss (MSA)",
  "Fachhochschulreife",
  "Allgemeine Hochschulreife (Abitur)",
  "Bachelor",
  "Master",
  "Noch kein Abschluss (schulpflichtig)",
] as const;

export const QUELLEN = [
  "Instagram",
  "Facebook",
  "Karriereseite des Landes",
  "Jobportal",
  "Familie oder Bekannte",
  "Sonstiges",
] as const;

const pflicht = z.string().min(1, "Bitte ausfüllen");
const auswahl = z.string().min(1, "Bitte auswählen");

export const grunddatenSchema = z.object({
  titel: z.string().optional(),
  nachname: pflicht,
  vorname: pflicht,
  weitereVornamen: z.string().optional(),
  email: z.email("Bitte eine gültige E-Mail-Adresse angeben"),
  geburtsdatum: pflicht,
  geburtsort: pflicht,
  geschlecht: auswahl,
  familienstand: auswahl,
  strasse: pflicht,
  hausnummer: pflicht,
  plz: z.string().regex(/^\d{5}$/, "Bitte eine gültige Postleitzahl angeben"),
  wohnort: pflicht,
  bundesland: auswahl,
  kreisStadtSH: z.string().optional(),
  geburtsname: z.string().optional(),
  geburtsland: auswahl,
  staatsangehoerigkeit: auswahl,
  telefonMobil: z.string().min(6, "Bitte eine erreichbare Mobilnummer angeben"),
  telefonPrivat: z.string().optional(),
  eingliederungsschein: z.boolean().optional(),
});

export const schwerbehinderungSchema = z
  .object({
    status: z.enum(["keine Angabe", "Schwerbehinderung", "Gleichstellung"], {
      message: "Bitte auswählen",
    }),
    gdb: z.string().optional(),
  })
  .check((ctx) => {
    if (ctx.value.status === "Schwerbehinderung" && !ctx.value.gdb) {
      ctx.issues.push({
        code: "custom",
        message: "Bitte den Grad der Behinderung angeben",
        path: ["gdb"],
        input: ctx.value.gdb,
      });
    }
  });

export const bildungEintragSchema = z.object({
  beginn: z.string().min(1, "Beginn angeben"),
  ende: z.string().min(1, "Ende angeben"),
  abschluss: z.string().min(1, "Abschluss auswählen"),
});

export const bildungSchema = z.object({
  eintraege: z.array(bildungEintragSchema).min(1, "Bitte mindestens einen Eintrag hinzufügen"),
});

export const berufEintragSchema = z.object({
  beginn: z.string().min(1, "Beginn angeben"),
  ende: z.string().optional(),
  berufsbezeichnung: z.string().min(1, "Berufsbezeichnung angeben"),
  firma: z.string().min(1, "Firma bzw. Behörde angeben"),
});

export const berufSchema = z.object({
  // Beruflicher Werdegang darf leer bleiben (Anwärter kommen oft direkt von der Schule)
  eintraege: z.array(berufEintragSchema),
});

export const anlagenSchema = z.object({
  motivation: z
    .string()
    .min(100, "Bitte mindestens ein paar Sätze schreiben (min. 100 Zeichen)"),
  quelle: auswahl,
});

export const pruefenSchema = z.object({
  einwilligungEmail: z.boolean().refine((v) => v, "Bitte bestätigen"),
  datenschutz: z.boolean().refine((v) => v, "Bitte bestätigen"),
});

export type Grunddaten = z.infer<typeof grunddatenSchema>;
export type Schwerbehinderung = z.infer<typeof schwerbehinderungSchema>;
export type Bildung = z.infer<typeof bildungSchema>;
export type Beruf = z.infer<typeof berufSchema>;
export type Anlagen = z.infer<typeof anlagenSchema>;
export type Pruefen = z.infer<typeof pruefenSchema>;

export type WizardData = {
  grunddaten?: Grunddaten;
  schwerbehinderung?: Schwerbehinderung;
  bildung?: Bildung;
  beruf?: Beruf;
  anlagen?: Anlagen;
  pruefen?: Pruefen;
};
