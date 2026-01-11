// Hauptanwendung
let fragebogenData = null;
let locationsData = null;

// Initialisierung
document.addEventListener('DOMContentLoaded', async () => {
    await loadFragebogen();
    await loadLocations();
    initializeEventListeners();
});

// Fragebogen laden
async function loadFragebogen() {
    try {
        const response = await fetch('/api/fragebogen');
        fragebogenData = await response.json();
        
        // Sprachauswahl füllen
        populateLanguageSelect();
        
        // Fragebogen rendern
        renderQuestionnaire();
    } catch (error) {
        console.error('Fehler beim Laden des Fragebogens:', error);
        showToast(t('load_error'), 'error');
    }
}

// Locations laden
async function loadLocations() {
    try {
        const response = await fetch('/api/locations');
        locationsData = await response.json();
        
        // Organisationseinheiten füllen
        populateOrganizations();
    } catch (error) {
        console.error('Fehler beim Laden der Locations:', error);
        showToast(t('load_error'), 'error');
    }
}

// Sprachauswahl füllen
function populateLanguageSelect() {
    const select = document.getElementById('languageSelect');
    select.innerHTML = '';
    
    fragebogenData.languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang.toUpperCase();
        select.appendChild(option);
    });
    
    select.value = currentLanguage;
}

// Organisationseinheiten füllen
function populateOrganizations() {
    const select = document.getElementById('orgSelect');
    const defaultOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    select.appendChild(defaultOption);
    
    locationsData.organisationseinheiten.forEach(org => {
        const option = document.createElement('option');
        option.value = org.id;
        option.textContent = org.name;
        select.appendChild(option);
    });
}

// Standorte basierend auf Organisationseinheit füllen
function populateLocations(orgId) {
    const select = document.getElementById('locationSelect');
    select.innerHTML = '';
    select.disabled = false;
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = t('select_location');
    select.appendChild(defaultOption);
    
    const org = locationsData.organisationseinheiten.find(o => o.id === orgId);
    
    if (org) {
        org.standorte.forEach(location => {
            const option = document.createElement('option');
            option.value = location.id;
            option.textContent = location.name;
            select.appendChild(option);
        });
    }
}

// Fragebogen rendern
function renderQuestionnaire() {
    const container = document.getElementById('questionnaireContainer');
    container.innerHTML = '';
    
    // Accordion für Kategorien
    const categoryAccordion = document.createElement('div');
    categoryAccordion.className = 'accordion';
    categoryAccordion.id = 'categoryAccordion';
    
    fragebogenData.categories.forEach((category, catIndex) => {
        const categoryItem = createCategoryAccordionItem(category, catIndex, catIndex === 0);
        categoryAccordion.appendChild(categoryItem);
    });
    
    container.appendChild(categoryAccordion);
}

// Kategorie als Accordion-Item erstellen
function createCategoryAccordionItem(category, catIndex, isFirstCategory) {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    
    const headerId = `heading-category-${category.id}`;
    const collapseId = `collapse-category-${category.id}`;
    
    // Header
    const header = document.createElement('h2');
    header.className = 'accordion-header';
    header.id = headerId;
    
    const button = document.createElement('button');
    button.className = `accordion-button ${isFirstCategory ? '' : 'collapsed'}`;
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#${collapseId}`);
    button.textContent = category.name[currentLanguage];
    
    header.appendChild(button);
    item.appendChild(header);
    
    // Body
    const collapseDiv = document.createElement('div');
    collapseDiv.id = collapseId;
    collapseDiv.className = `accordion-collapse collapse ${isFirstCategory ? 'show' : ''}`;
    collapseDiv.setAttribute('data-bs-parent', '#categoryAccordion');
    
    const body = document.createElement('div');
    body.className = 'accordion-body';
    
    // Grid-Container für Fragen
    const questionsGrid = document.createElement('div');
    questionsGrid.className = 'questions-grid';
    
    // Fragen als Karten (nicht als Accordion)
    category.questions.forEach((question, qIndex) => {
        const questionCard = createQuestionCard(question, qIndex);
        questionsGrid.appendChild(questionCard);
    });
    
    body.appendChild(questionsGrid);
    
    collapseDiv.appendChild(body);
    item.appendChild(collapseDiv);
    
    return item;
}

// Einzelne Frage als Karte erstellen
function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'card question-card';
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    // Fragen-Titel
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.innerHTML = `
        <span class="question-number">${index + 1}</span>
        <span>${question.text[currentLanguage]}</span>
    `;
    cardBody.appendChild(title);
    
    // Beschreibung
    const description = document.createElement('p');
    description.className = 'card-text text-muted mb-3';
    description.textContent = question.description[currentLanguage];
    cardBody.appendChild(description);
    
    // Rating
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'mb-3';
    
    const ratingLabel = document.createElement('label');
    ratingLabel.className = 'form-label fw-bold';
    ratingLabel.textContent = t('rating_label');
    ratingDiv.appendChild(ratingLabel);
    
    const starContainer = document.createElement('div');
    starContainer.className = 'star-rating';
    starContainer.id = `rating-${question.id}`;
    ratingDiv.appendChild(starContainer);
    
    const ratingDisplay = document.createElement('div');
    ratingDisplay.className = 'rating-display';
    ratingDisplay.id = `rating-display-${question.id}`;
    ratingDisplay.innerHTML = `<span class="text-muted">${t('no_rating')}</span>`;
    ratingDiv.appendChild(ratingDisplay);
    
    cardBody.appendChild(ratingDiv);
    
    // Kommentar
    const commentDiv = document.createElement('div');
    commentDiv.className = 'mb-0';
    
    const commentLabel = document.createElement('label');
    commentLabel.className = 'form-label fw-bold';
    commentLabel.htmlFor = `comment-${question.id}`;
    commentLabel.textContent = t('comment_label');
    commentDiv.appendChild(commentLabel);
    
    const commentTextarea = document.createElement('textarea');
    commentTextarea.className = 'form-control comment-textarea';
    commentTextarea.id = `comment-${question.id}`;
    commentTextarea.rows = 3;
    commentDiv.appendChild(commentTextarea);
    
    cardBody.appendChild(commentDiv);
    card.appendChild(cardBody);
    
    // Rating initialisieren
    setTimeout(() => {
        ratingManager.createRating(`rating-${question.id}`, question.id);
    }, 0);
    
    return card;
}

// Event Listeners initialisieren
function initializeEventListeners() {
    // Sprachwechsel
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        setLanguage(e.target.value);
        renderQuestionnaire();
    });
    
    // Organisationseinheit-Wechsel
    document.getElementById('orgSelect').addEventListener('change', (e) => {
        const orgId = e.target.value;
        if (orgId) {
            populateLocations(orgId);
        } else {
            document.getElementById('locationSelect').disabled = true;
            document.getElementById('locationSelect').innerHTML = '<option value="">' + t('select_location') + '</option>';
        }
    });
    
    // Speichern
    document.getElementById('saveButton').addEventListener('click', saveQuestionnaire);
    
    // Laden
    document.getElementById('loadButton').addEventListener('click', showLoadModal);
}

// Fragebogen speichern
async function saveQuestionnaire() {
    const orgId = document.getElementById('orgSelect').value;
    const locationId = document.getElementById('locationSelect').value;
    
    if (!orgId || !locationId) {
        showToast(t('validation_error'), 'error');
        return;
    }
    
    // Antworten sammeln
    const answers = {};
    fragebogenData.categories.forEach(category => {
        category.questions.forEach(question => {
            const rating = ratingManager.getRating(question.id);
            const comment = document.getElementById(`comment-${question.id}`).value;
            
            answers[question.id] = {
                rating: rating,
                comment: comment
            };
        });
    });
    
    const data = {
        organisationseinheit: orgId,
        standort: locationId,
        language: currentLanguage,
        answers: answers
    };
    
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast(t('save_success'), 'success');
        } else {
            showToast(t('save_error'), 'error');
        }
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        showToast(t('save_error'), 'error');
    }
}

// Load-Modal anzeigen
async function showLoadModal() {
    try {
        const response = await fetch('/api/list-saves');
        const saves = await response.json();
        
        const savesList = document.getElementById('savesList');
        savesList.innerHTML = '';
        
        if (saves.length === 0) {
            savesList.innerHTML = `<p class="text-muted">${t('no_saves_found')}</p>`;
        } else {
            saves.forEach(save => {
                const saveItem = createSaveItem(save);
                savesList.appendChild(saveItem);
            });
        }
        
        const modal = new bootstrap.Modal(document.getElementById('loadModal'));
        modal.show();
    } catch (error) {
        console.error('Fehler beim Laden der Liste:', error);
        showToast(t('load_error'), 'error');
    }
}

// Save-Item erstellen
function createSaveItem(save) {
    const div = document.createElement('div');
    div.className = 'save-item';
    
    div.innerHTML = `
        <div class="save-item-header">${save.timestamp}</div>
        <div class="save-item-meta">
            ${save.organisationseinheit} - ${save.standort}
        </div>
    `;
    
    div.addEventListener('click', () => loadSave(save.filename));
    
    return div;
}

// Gespeicherten Fragebogen laden
async function loadSave(filename) {
    try {
        const response = await fetch(`/api/load/${filename}`);
        const data = await response.json();
        
        // Organisationseinheit und Standort setzen
        document.getElementById('orgSelect').value = data.organisationseinheit;
        populateLocations(data.organisationseinheit);
        
        setTimeout(() => {
            document.getElementById('locationSelect').value = data.standort;
        }, 100);
        
        // Sprache setzen
        if (data.language) {
            document.getElementById('languageSelect').value = data.language;
            setLanguage(data.language);
            renderQuestionnaire();
        }
        
        // Antworten laden
        setTimeout(() => {
            Object.keys(data.answers).forEach(questionId => {
                const answer = data.answers[questionId];
                
                // Rating laden
                if (ratingManager.ratings[questionId]) {
                    ratingManager.ratings[questionId].loadRating(answer.rating);
                }
                
                // Kommentar laden
                const commentField = document.getElementById(`comment-${questionId}`);
                if (commentField) {
                    commentField.value = answer.comment || '';
                }
            });
        }, 500);
        
        // Modal schließen
        const modal = bootstrap.Modal.getInstance(document.getElementById('loadModal'));
        modal.hide();
        
        showToast(t('load_success'), 'success');
    } catch (error) {
        console.error('Fehler beim Laden:', error);
        showToast(t('load_error'), 'error');
    }
}

// Toast anzeigen
function showToast(message, type = 'success') {
    const toastElement = document.getElementById('saveToast');
    const toastBody = document.getElementById('toastMessage');
    
    toastBody.textContent = message;
    
    toastElement.classList.remove('toast-success', 'toast-error');
    toastElement.classList.add(`toast-${type}`);
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}
