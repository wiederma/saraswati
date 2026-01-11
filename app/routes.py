from flask import Blueprint, render_template, jsonify, request, current_app
from app.utils import load_json_file, save_json_file, generate_response_filename, list_response_files
from datetime import datetime
import os

main = Blueprint('main', __name__)

@main.route('/')
def index():
    """Hauptseite der Anwendung"""
    return render_template('index.html')

@main.route('/api/fragebogen')
def get_fragebogen():
    """API-Endpunkt für Fragebogen-Daten"""
    fragebogen_path = os.path.join(current_app.config['DATA_FOLDER'], 'fragebogen.json')
    data = load_json_file(fragebogen_path)
    
    if data is None:
        return jsonify({'error': 'Fragebogen nicht gefunden'}), 404
    
    return jsonify(data)

@main.route('/api/locations')
def get_locations():
    """API-Endpunkt für Standort-Daten"""
    locations_path = os.path.join(current_app.config['DATA_FOLDER'], 'locations.json')
    data = load_json_file(locations_path)
    
    if data is None:
        return jsonify({'error': 'Locations nicht gefunden'}), 404
    
    return jsonify(data)

@main.route('/api/save', methods=['POST'])
def save_response():
    """Speichert ausgefüllten Fragebogen"""
    try:
        data = request.get_json()
        
        # Validierung
        if not data.get('organisationseinheit') or not data.get('standort'):
            return jsonify({'error': 'Organisationseinheit und Standort müssen ausgewählt sein'}), 400
        
        # Timestamp hinzufügen
        data['timestamp'] = datetime.now().isoformat()
        
        # Dateinamen generieren
        filename = generate_response_filename(
            data.get('organisationseinheit', 'unknown'),
            data.get('standort', 'unknown')
        )
        
        filepath = os.path.join(current_app.config['RESPONSES_FOLDER'], filename)
        
        # Speichern
        if save_json_file(filepath, data):
            return jsonify({
                'success': True,
                'filename': filename,
                'message': 'Erfolgreich gespeichert'
            })
        else:
            return jsonify({'error': 'Fehler beim Speichern'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/list-saves')
def list_saves():
    """Listet alle gespeicherten Antworten auf"""
    files = list_response_files(current_app.config['RESPONSES_FOLDER'])
    
    # Metadaten für jede Datei laden
    saves = []
    for filename in files:
        filepath = os.path.join(current_app.config['RESPONSES_FOLDER'], filename)
        data = load_json_file(filepath)
        
        if data:
            saves.append({
                'filename': filename,
                'timestamp': data.get('timestamp', 'Unbekannt'),
                'organisationseinheit': data.get('organisationseinheit', 'Unbekannt'),
                'standort': data.get('standort', 'Unbekannt'),
                'language': data.get('language', 'de')
            })
    
    return jsonify(saves)

@main.route('/api/load/<filename>')
def load_response(filename):
    """Lädt eine gespeicherte Antwort"""
    # Sicherheitscheck: Nur Dateien aus dem responses-Ordner
    if '..' in filename or '/' in filename or '\\' in filename:
        return jsonify({'error': 'Ungültiger Dateiname'}), 400
    
    filepath = os.path.join(current_app.config['RESPONSES_FOLDER'], filename)
    data = load_json_file(filepath)
    
    if data is None:
        return jsonify({'error': 'Datei nicht gefunden'}), 404
    
    return jsonify(data)
