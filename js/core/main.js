// Main initialization module

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Create header and footer
    createHeader();
    createFooter();
    
    // Initialize language
    initializeLanguage();
    updateLanguage();
    
    // Load and display events dynamically on the events page
    loadEvents();

    // Adjust spacing in imprint address blocks (only on imprint page)
    if (typeof imprintAddressSpacing === 'function') {
        imprintAddressSpacing();
    }
});
