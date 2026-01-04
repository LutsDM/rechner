# Arbeitszeit Rechner

Ein kleiner Arbeitszeit-Rechner, der als Grundlage für ein internes Tool zur Zeiterfassung gedacht ist.  
Das Projekt ist am ersten Arbeitstag in einem neuen Job entstanden und orientiert sich an realen Anforderungen aus dem Arbeitsalltag.

## 🚀 Features

- Erfassung eines Arbeitstags mit **einer zentralen Datumsangabe**
- Arbeitszeit:
  - Arbeitsbeginn (Von)
  - Arbeitsende (Bis)
- Optionale **Fahrzeit**:
  - Abfahrt
  - Ankunft
- Plausibilitätsprüfungen:
  - Arbeitsbeginn < Arbeitsende
  - Abfahrt ≤ Ankunft
  - Arbeitsbeginn nicht vor Ankunft
  - Abfahrt nicht nach Arbeitsende
- Übersichtlicher **Zeitbericht**:
  - Arbeitszeit
  - Fahrzeit
  - Gesamtzeit
- Mobile-freundliches Layout (optimiert für Smartphone-Nutzung)

## 🧠 Motivation

Ziel war es, ein möglichst praxisnahes Tool zu bauen, das reale Arbeitsprozesse widerspiegelt.  
Der Rechner soll nicht nur Zeiten addieren, sondern typische Fehler vermeiden und logisch korrekte Eingaben erzwingen.

## 🛠 Tech Stack

- React
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## 📈 Mögliche Weiterentwicklung

- Entfernen der Sekunden zur Vereinfachung der Eingabe
- Unterstützung mehrerer Mitarbeiter
- Erfassung von Kundendaten
- Speicherung der Daten in einer Datenbank
- PDF-Berichte für Kunden
- Integration in die Rechnungserstellung
- Export (CSV / PDF)

## ▶️ Demo

GitHub Pages:  
https://lutsdm.github.io/rechner/

## 📝 Hinweis

Das Projekt ist als funktionaler Prototyp gedacht und dient als Ausgangspunkt für ein internes Zeiterfassungssystem.

---

Made with a mix of real requirements, AI support and hands-on coding.
