import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DATA_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    RESPONSES_FOLDER = os.path.join(DATA_FOLDER, 'responses')
    FRAGEBOGEN_FILE = os.path.join(DATA_FOLDER, 'fragebogen.json')
    LOCATIONS_FILE = os.path.join(DATA_FOLDER, 'locations.json')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
