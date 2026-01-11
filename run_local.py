#!/usr/bin/env python3
"""
Startet die Fragebogen-Anwendung lokal im Browser
"""
from app import create_app

if __name__ == '__main__':
    app = create_app()
    print("=" * 60)
    print("Fragebogen-Anwendung wird gestartet...")
    print("Öffne deinen Browser unter: http://localhost:5000")
    print("Drücke STRG+C zum Beenden")
    print("=" * 60)
    app.run(debug=True, host='127.0.0.1', port=5000)
