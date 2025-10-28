// Language Management
let currentLanguage = 'de'; // Default language

// Load saved language preference
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        updateLanguage();
    }
    
    // Filter out old events on the events page
    filterOldEvents();
});

// Toggle between German and English
function toggleLanguage() {
    currentLanguage = currentLanguage === 'de' ? 'en' : 'de';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
}

// Update all multilingual elements
function updateLanguage() {
    // Update flag icon and language text
    const flag = document.getElementById('flag');
    const langText = document.getElementById('lang-text');
    if (flag) {
        flag.src = currentLanguage === 'de' ? 'flag-de.svg' : 'flag-gb.svg';
        flag.alt = currentLanguage === 'de' ? 'German Flag' : 'UK Flag';
    }
    if (langText) {
        langText.textContent = currentLanguage === 'de' ? 'DE' : 'EN';
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Update all elements with multilang class
    const elements = document.querySelectorAll('.multilang');
    elements.forEach(element => {
        const translation = element.getAttribute('data-' + currentLanguage);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-links a[data-de][data-en]');
    navLinks.forEach(link => {
        const translation = link.getAttribute('data-' + currentLanguage);
        if (translation) {
            link.textContent = translation;
        }
    });
}

// Filter out events that have already passed
function filterOldEvents() {
    const eventCards = document.querySelectorAll('.event-card[data-event-date]');
    
    // Only process if there are event cards on the page
    if (eventCards.length === 0) {
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison
    
    eventCards.forEach(card => {
        const eventDateStr = card.getAttribute('data-event-date');
        if (eventDateStr) {
            const eventDate = new Date(eventDateStr);
            eventDate.setHours(0, 0, 0, 0);
            
            // Hide events that are in the past
            if (eventDate < today) {
                card.style.display = 'none';
            }
        }
    });
}
