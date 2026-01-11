import json
import os
from datetime import datetime

def load_json_file(filepath):
    """Lädt eine JSON-Datei und gibt den Inhalt zurück"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError:
        return None

def save_json_file(filepath, data):
    """Speichert Daten in eine JSON-Datei"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Fehler beim Speichern: {e}")
        return False

def generate_response_filename(org_id, location_id):
    """Generiert einen Dateinamen für gespeicherte Antworten"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"response_{org_id}_{location_id}_{timestamp}.json"

def list_response_files(responses_folder):
    """Listet alle gespeicherten Antwort-Dateien auf"""
    try:
        files = [f for f in os.listdir(responses_folder) if f.endswith('.json')]
        files.sort(reverse=True)  # Neueste zuerst
        return files
    except Exception:
        return []
