# Mobile Bewerbungsstrecke Schleswig-Holstein (Klick-Prototyp)

Ein Open-Source-Prototyp von EDGE Digital. Er zeigt, wie die Online-Bewerbung
für Stellen der Landesverwaltung Schleswig-Holstein (Beispiel:
Regierungsinspektoranwärter/in, Einstellung 2027) mobile first aussehen kann.

Der Prototyp ist als Anforderungsdokument gedacht: Das Land kann ihn nutzen, um
gegenüber dem IT-Dienstleister konkrete, klickbare Anforderungen an eine
mobiltaugliche Bewerbungsstrecke zu formulieren.

## Warum dieser Prototyp existiert

Die Recruiting-Kampagne erreicht die Zielgruppe fast ausschließlich am
Smartphone. Das bestehende Bewerbungsportal bremst genau dort:

| Bestehendes Portal | Dieser Prototyp |
| --- | --- |
| Desktop-Layout, mobil seitlich abgeschnitten | Mobile first, ein Gedanke pro Schritt |
| Keine Zwischenspeicherung, 120-Minuten-Session | Automatisches Speichern auf dem Gerät, jederzeit fortsetzbar |
| Tabellen mit Plus/Haken-Icons für Mehrfacheinträge | Wiederholbare Einträge als Cards mit großem Hinzufügen-Button |
| Upload-Regeln erst beim Abschicken sichtbar | PDF-Pflicht, 20-MB-Grenze und Sonderzeichen-Check live beim Auswählen |
| Captcha mit Zeichenfolge am Ende | Unsichtbarer Bot-Schutz, keine Nutzeraktion nötig |
| Doppelte E-Mail-Eingabe, getrennte Vorwahl-Felder | Ein E-Mail-Feld, ein Telefonfeld, native Datums-Picker |

Alle Felder und Pflichtangaben entsprechen der Original-Bewerbungsstrecke
(Grunddaten, Schwerbehinderung, Schule/Studium, Beruf, Anlagen inklusive der
beiden Einwilligungserklärungen).

## Datenschutz

Der Prototyp hat kein Backend. Es existiert kein Endpunkt, der Daten
entgegennimmt. Alle Eingaben bleiben ausschließlich im localStorage des
eigenen Geräts und lassen sich über "Prototyp zurücksetzen" löschen.
Hochgeladene Dateien werden nur im Arbeitsspeicher des Browsers gehalten.

## Tech-Stack

Next.js (App Router, statischer Export ohne Backend), TypeScript, Tailwind
CSS v4, shadcn/ui, React Hook Form + Zod, Motion. Bewusste Entscheidung:
native Selects und native Datums-Inputs, weil sie auf iOS und Android die
Systembedienelemente öffnen.

Schrift: Avenir Next, die Hausschrift des Landesdesigns. Auf macOS und iOS
greift die vorinstallierte Systemversion, für alle anderen Systeme wird die
Schrift selbst gehostet (Lizenz liegt vor).

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktions-Build
```

## Bekannte Prototyp-Grenzen

Dateien überleben einen Reload nicht (localStorage kann keine Dateien
speichern). Die Metadaten bleiben erhalten, die Strecke bittet um erneutes
Anhängen. In einer echten Umsetzung übernimmt das ein Server mit
Wiederaufnahme-Link per E-Mail.

Der Datenschutzhinweis-Link, das Aktenzeichen und die Eingangsbestätigung
sind simuliert.

## Lizenz

Der Quellcode dieses Repositorys steht unter der MIT-Lizenz (siehe LICENSE).
Sie dürfen ihn frei einsehen, anpassen und als Grundlage weiterverwenden.

Ausgenommen von dieser Lizenz sind Drittinhalte:

- Die Schrift Avenir Next ist kommerziell lizenziert und nicht Teil dieser
  Freigabe. Wer den Code weiterverwendet, benötigt eine eigene Schriftlizenz.
- Das Logo und das Wappen des Landes Schleswig-Holstein sind geschützt und
  liegen beim Land. Sie sind hier nur zur Veranschaulichung eingebunden.

---

EDGE Digital · Prototyp zur Kampagne Nachwuchskräfte-Recruiting 2027
