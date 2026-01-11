# saraswati
questionaire tool supporting multiple languages, rating, comments and report generation


# Fragebogen-Anwendung - Phishing Assessment

Eine mehrsprachige Web-Anwendung zur Bewertung von Phishing-Erkennung und Erstreaktion.

## Features

- ✅ Mehrsprachige Unterstützung (DE/EN)
- ✅ 5-Sterne-Bewertungssystem
- ✅ Kommentarfunktion für jede Frage
- ✅ Standort- und Organisationseinheitenverwaltung
- ✅ Speichern und Laden von Zwischenständen
- ✅ Responsive Design mit Bootstrap
- ✅ Lokaler Betrieb oder als Desktop-App

## Installation

### Voraussetzungen

- Python 3.8 oder höher
- pip (Python Package Manager)

### Setup

1. **Repository klonen oder Dateien entpacken**

2. **Virtuelle Umgebung erstellen (empfohlen)**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Abhängigkeiten installieren**
   ```bash
   pip install -r requirements.txt
   ```

4. **JSON-Dateien vorbereiten**
   
   Stelle sicher, dass folgende Dateien im `data/` Ordner vorhanden sind:
   - `fragebogen.json` - Fragebogen-Definition
   - `locations.json` - Standorte und Organisationseinheiten

## Verwendung

### Lokaler Start im Browser

```bash
python run_local.py
```

Die Anwendung ist dann unter `http://localhost:5000` erreichbar.

### Desktop-Anwendung mit pywebview

```bash
python run_webview.py
```

Öffnet die Anwendung in einem nativen Desktop-Fenster.

## Ordnerstruktur

```
fragebogen-app/
├── app/
│   ├── __init__.py          # Flask App Initialisierung
│   ├── routes.py            # API-Endpunkte
│   ├── config.py            # Konfiguration
│   └── utils.py             # Hilfsfunktionen
├── static/
│   ├── css/
│   │   └── custom.css       # Custom Styling
│   └── js/
│       ├── fragebogen.js    # Hauptlogik
│       ├── ratings.js       # Star-Rating System
│       └── language.js      # Sprachverwaltung
├── templates/
│   └── index.html           # HTML-Template
├── data/
│   ├── fragebogen.json      # Fragebogen-Daten
│   ├── locations.json       # Standort-Daten
│   └── responses/           # Gespeicherte Antworten
├── requirements.txt         # Python-Abhängigkeiten
├── run_local.py            # Lokaler Start-Script
├── run_webview.py          # Desktop-App Start-Script
└── README.md               # Diese Datei
```

## Funktionen im Detail

### Allgemeine Einstellungen

- **Sprachauswahl**: Wechsel zwischen verfügbaren Sprachen
- **Organisationseinheit**: Auswahl der Abteilung/Region
- **Standort**: Standortauswahl basierend auf Organisationseinheit

### Fragebogen

- **Kategorien**: Fragen sind in Kategorien gruppiert
- **Accordion-Ansicht**: Erste Frage aufgeklappt, andere zugeklappt
- **5-Sterne-Rating**: Interaktive Bewertung pro Frage
- **Kommentarfelder**: Zusätzliche Anmerkungen erfassen

### Speichern & Laden

- **Speichern**: JSON-Export mit Timestamp und Standortinformationen
- **Laden**: Auswahl aus vorherigen Speicherständen
- **Auto-Validierung**: Prüft erforderliche Felder vor dem Speichern

## API-Endpunkte

- `GET /` - Hauptseite
- `GET /api/fragebogen` - Fragebogen-Daten
- `GET /api/locations` - Standort-Daten
- `POST /api/save` - Fragebogen speichern
- `GET /api/list-saves` - Liste gespeicherter Fragebögen
- `GET /api/load/<filename>` - Gespeicherten Fragebogen laden

## Gespeicherte Daten

Antworten werden im JSON-Format unter `data/responses/` gespeichert:

```json
{
  "timestamp": "2026-01-11T10:30:00",
  "organisationseinheit": "emea",
  "standort": "DE-A3F12",
  "language": "de",
  "answers": {
    "q1": {
      "rating": 4,
      "comment": "Kommentar..."
    }
  }
}
```

## Fehlerbehebung

### Port bereits belegt
Falls Port 5000 bereits verwendet wird, ändere in `run_local.py`:
```python
app.run(debug=True, host='127.0.0.1', port=5001)
```

### Pywebview startet nicht
Stelle sicher, dass die erforderlichen System-Bibliotheken installiert sind:
- **Windows**: Keine zusätzlichen Anforderungen
- **Linux**: `sudo apt-get install python3-gi python3-gi-cairo gir1.2-gtk-3.0 gir1.2-webkit2-4.0`
- **macOS**: `brew install pyobjc`

## Lizenz

Dieses Projekt ist für den internen Gebrauch bestimmt.

## Support

Bei Fragen oder Problemen wende dich an das IT-Team.
