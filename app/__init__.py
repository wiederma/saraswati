from flask import Flask
import os

def create_app():
    # Setze template_folder und static_folder relativ zum Projekt-Root
    template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
    
    app = Flask(__name__, 
                template_folder=template_dir,
                static_folder=static_dir)
    
    # Konfiguration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['DATA_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    app.config['RESPONSES_FOLDER'] = os.path.join(app.config['DATA_FOLDER'], 'responses')
    
    # Sicherstellen, dass Ordner existieren
    os.makedirs(app.config['RESPONSES_FOLDER'], exist_ok=True)
    
    # Routen registrieren
    from app.routes import main
    app.register_blueprint(main)
    
    return app
