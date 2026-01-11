// Star Rating Funktionalität
class StarRating {
    constructor(containerId, questionId) {
        this.container = document.getElementById(containerId);
        this.questionId = questionId;
        this.currentRating = 0;
        this.stars = [];
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = 'bi bi-star-fill star';
            star.dataset.value = i;
            
            star.addEventListener('click', () => this.setRating(i));
            star.addEventListener('mouseenter', () => this.highlightStars(i));
            star.addEventListener('mouseleave', () => this.highlightStars(this.currentRating));
            
            this.stars.push(star);
            this.container.appendChild(star);
        }
    }

    setRating(rating) {
        this.currentRating = rating;
        this.highlightStars(rating);
        this.updateRatingDisplay();
        
        // Event für Änderung auslösen
        const event = new CustomEvent('ratingChanged', {
            detail: { questionId: this.questionId, rating: rating }
        });
        this.container.dispatchEvent(event);
    }

    highlightStars(count) {
        this.stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    updateRatingDisplay() {
        const displayElement = document.getElementById(`rating-display-${this.questionId}`);
        if (displayElement) {
            if (this.currentRating > 0) {
                displayElement.innerHTML = `<span class="rating-value">${this.currentRating} ${t('stars')}</span>`;
            } else {
                displayElement.innerHTML = `<span class="text-muted">${t('no_rating')}</span>`;
            }
        }
    }

    getRating() {
        return this.currentRating;
    }

    loadRating(rating) {
        this.currentRating = rating;
        this.highlightStars(rating);
        this.updateRatingDisplay();
    }
}

// Globales Rating-Manager-Objekt
const ratingManager = {
    ratings: {},
    
    createRating(containerId, questionId) {
        this.ratings[questionId] = new StarRating(containerId, questionId);
        return this.ratings[questionId];
    },
    
    getRating(questionId) {
        return this.ratings[questionId] ? this.ratings[questionId].getRating() : 0;
    },
    
    getAllRatings() {
        const allRatings = {};
        Object.keys(this.ratings).forEach(questionId => {
            allRatings[questionId] = this.ratings[questionId].getRating();
        });
        return allRatings;
    },
    
    loadRatings(ratingsData) {
        Object.keys(ratingsData).forEach(questionId => {
            if (this.ratings[questionId]) {
                this.ratings[questionId].loadRating(ratingsData[questionId]);
            }
        });
    }
};
