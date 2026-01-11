// Sprachverwaltung
const translations = {
    de: {
        settings_title: 'Allgemeine Einstellungen',
        language_label: 'Sprache',
        org_label: 'Organisationseinheit',
        location_label: 'Standort',
        select_org: 'Bitte wählen...',
        select_location: 'Zuerst Organisationseinheit wählen',
        save_button: 'Speichern',
        load_button: 'Laden',
        notification: 'Benachrichtigung',
        load_modal_title: 'Gespeicherte Fragebögen',
        rating_label: 'Bewertung',
        comment_label: 'Kommentar',
        no_rating: 'Keine Bewertung',
        stars: 'Sterne',
        save_success: 'Erfolgreich gespeichert!',
        save_error: 'Fehler beim Speichern',
        validation_error: 'Bitte wählen Sie Organisationseinheit und Standort aus',
        load_success: 'Erfolgreich geladen!',
        load_error: 'Fehler beim Laden',
        no_saves_found: 'Keine gespeicherten Fragebögen gefunden'
    },
    en: {
        settings_title: 'General Settings',
        language_label: 'Language',
        org_label: 'Organizational Unit',
        location_label: 'Location',
        select_org: 'Please select...',
        select_location: 'Select organizational unit first',
        save_button: 'Save',
        load_button: 'Load',
        notification: 'Notification',
        load_modal_title: 'Saved Questionnaires',
        rating_label: 'Rating',
        comment_label: 'Comment',
        no_rating: 'No rating',
        stars: 'stars',
        save_success: 'Successfully saved!',
        save_error: 'Error saving',
        validation_error: 'Please select organizational unit and location',
        load_success: 'Successfully loaded!',
        load_error: 'Error loading',
        no_saves_found: 'No saved questionnaires found'
    }
};

let currentLanguage = 'de';

function setLanguage(lang) {
    currentLanguage = lang;
    updateUILanguage();
}

function updateUILanguage() {
    // Alle Elemente mit data-lang-key aktualisieren
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

function t(key) {
    return translations[currentLanguage][key] || key;
}
