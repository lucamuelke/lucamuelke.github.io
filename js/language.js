// Language Management Module
let currentLanguage = 'de'; // Default language

// Load saved language preference
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
}

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
        flag.src = currentLanguage === 'de' ? 'assets/flag-de.svg' : 'assets/flag-gb.svg';
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
            // Use innerHTML if the translation contains HTML tags, otherwise use textContent
            if (translation.includes('<')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
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
    
    // Update month names in event cards
    if (typeof updateEventMonths === 'function') {
        updateEventMonths();
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}
