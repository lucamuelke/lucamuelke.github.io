// Language Management
let currentLanguage = 'de'; // Default language

// Load saved language preference
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        updateLanguage();
    }
});

// Toggle between German and English
function toggleLanguage() {
    currentLanguage = currentLanguage === 'de' ? 'en' : 'de';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
}

// Update all multilingual elements
function updateLanguage() {
    // Update flag icon
    const flag = document.getElementById('flag');
    flag.textContent = currentLanguage === 'de' ? '🇩🇪' : '🇬🇧';
    
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
