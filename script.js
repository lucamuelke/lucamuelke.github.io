// Language Management
let currentLanguage = 'de'; // Default language

// Create and insert header
function createHeader() {
    // Prevent duplicate headers
    if (document.querySelector('header.banner')) {
        return;
    }
    
    const pathname = window.location.pathname;
    const currentPage = pathname.endsWith('/') ? 'index.html' : pathname.split('/').pop() || 'index.html';
    
    const header = document.createElement('header');
    header.className = 'banner';
    header.innerHTML = `
        <div class="container">
            <a href="index.html" class="logo">
                <img src="Logo_BoulderING_V01-1.svg" alt="BoulderING AG Logo" class="logo-icon">
                <span class="logo-text">BoulderING AG</span>
            </a>
            <nav>
                <ul class="nav-links">
                    <li><a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''} data-de="Start" data-en="Home">Start</a></li>
                    <li><a href="events.html" ${currentPage === 'events.html' ? 'class="active"' : ''} data-de="Termine" data-en="Events">Termine</a></li>
                    <li><a href="impressum.html" ${currentPage === 'impressum.html' ? 'class="active"' : ''} data-de="Impressum" data-en="Imprint">Impressum</a></li>
                </ul>
            </nav>
            <button class="language-toggle" onclick="toggleLanguage()" aria-label="Toggle Language">
                <img id="flag" src="flag-de.svg" alt="German Flag" class="flag-icon">
                <span id="lang-text">DE</span>
            </button>
        </div>
    `;
    
    document.body.insertBefore(header, document.body.firstChild);
}

// Create and insert footer
function createFooter() {
    // Prevent duplicate footers
    if (document.querySelector('footer')) {
        return;
    }
    
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="container">
            <a href="https://tuhh.de" target="_blank" rel="noopener noreferrer" class="footer-logo-left">
                <img src="TUHH_logo_rgb.svg" alt="TUHH Logo" class="footer-logo">
            </a>
            <p class="footer-text">&copy; 2025 BoulderING AG | <a href="impressum.html" class="multilang" data-de="Impressum" data-en="Imprint">Impressum</a></p>
            <a href="https://www.asta.tuhh.de" target="_blank" rel="noopener noreferrer" class="footer-logo-right">
                <img src="astaLogo.svg" alt="AStA Logo" class="footer-logo">
            </a>
        </div>
    `;
    
    document.body.appendChild(footer);
}

// Load saved language preference
document.addEventListener('DOMContentLoaded', function() {
    // Create header and footer
    createHeader();
    createFooter();
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        updateLanguage();
    }
    
    // Load and display events dynamically on the events page
    loadEvents();
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
    updateEventMonths();
}

// Update month names in dynamically generated event cards
function updateEventMonths() {
    const monthNames = {
        de: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'],
        en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    };
    
    const eventCards = document.querySelectorAll('.event-card[data-event-date]');
    eventCards.forEach(card => {
        const eventDateStr = card.getAttribute('data-event-date');
        if (eventDateStr) {
            const eventDate = new Date(eventDateStr);
            const month = monthNames[currentLanguage][eventDate.getMonth()];
            const monthSpan = card.querySelector('.event-date .month');
            if (monthSpan) {
                monthSpan.textContent = month;
            }
        }
    });
}

// Load and display events
async function loadEvents() {
    const eventsContainer = document.querySelector('.events-list');
    
    // Only process if we're on the events page
    if (!eventsContainer) {
        return;
    }
    
    try {
        // Force fetch from network, bypassing all caches
        const response = await fetch('events.json', {
            cache: 'no-store'
        });
        const data = await response.json();
        
        // Generate all events (manual + recurring-generated)
        const allEvents = generateAllEvents(data);
        
        // Clear existing events
        eventsContainer.innerHTML = '';
        
        // Render events
        allEvents.forEach(event => {
            const eventCard = createEventCard(event);
            eventsContainer.appendChild(eventCard);
        });
        
        // Update language for dynamically created content
        updateLanguage();
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = '<p class="error">Fehler beim Laden der Events / Error loading events</p>';
    }
}

// Generate all events (manual + recurring)
function generateAllEvents(data) {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const allEvents = [];
    
    // Add manual events (show until end time has passed)
    if (data.events) {
        data.events.forEach(event => {
            // For multi-day events, check against endDate; for single-day, check against date
            const finalDate = event.endDate || event.date;
            const eventEndDateTime = new Date(`${finalDate}T${event.endTime}`);
            if (eventEndDateTime >= now) {
                allEvents.push({
                    ...event,
                    type: 'manual',
                    dateTime: new Date(`${event.date}T${event.startTime}`)
                });
            }
        });
    }
    
    // Generate recurring events
    if (data.recurringEvents) {
        // Iterate over all recurring event types
        Object.values(data.recurringEvents).forEach(recurringEvent => {
            const currentDate = new Date(now);
            currentDate.setHours(0, 0, 0, 0);
            
            // Generate events for the next month
            while (currentDate <= oneMonthFromNow) {
                // Check if it matches the configured day of week
                if (currentDate.getDay() === recurringEvent.dayOfWeek) {
                    const eventDateStr = currentDate.toISOString().split('T')[0];
                    const eventDateTime = new Date(`${eventDateStr}T${recurringEvent.startTime}`);
                    
                    // Check if this day has a conflicting manual event
                    const hasConflict = allEvents.some(manualEvent => {
                        return manualEvent.date === eventDateStr && !manualEvent.allowRecurringEvent;
                    });
                    
                    // Only add if no conflict or if event is in the future
                    if (!hasConflict && eventDateTime >= now) {
                        allEvents.push({
                            date: eventDateStr,
                            startTime: recurringEvent.startTime,
                            endTime: recurringEvent.endTime,
                            title: recurringEvent.title,
                            location: recurringEvent.location,
                            description: recurringEvent.description,
                            highlight: recurringEvent.highlight,
                            type: 'recurring',
                            dateTime: eventDateTime
                        });
                    }
                }
                
                // Move to next day
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
    }
    
    // Sort events by date and time
    allEvents.sort((a, b) => a.dateTime - b.dateTime);
    
    return allEvents;
}

// Create event card HTML element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card' + (event.highlight ? ' highlight' : '');
    card.setAttribute('data-event-date', event.date);
    card.setAttribute('data-event-type', event.type);
    
    // Parse start date
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const monthNames = {
        de: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'],
        en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    };
    const month = monthNames[currentLanguage][eventDate.getMonth()];
    
    // Weekday name constants
    const weekdayNamesFull = {
        de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    const weekdayNamesShort = {
        de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };
    
    // Check if multi-day event and validate endDate
    const isMultiDay = event.endDate && event.endDate !== event.date;
    let dateRangeDisplay = '';
    let weekdayDisplayDe = '';
    let weekdayDisplayEn = '';
    let endDate = null;
    
    if (isMultiDay) {
        endDate = new Date(event.endDate);

        // Validate endDate
        if (isNaN(endDate.getTime()) || endDate < eventDate) {
            console.warn(`Invalid endDate for event: ${event.title.de}. Treating as single-day event.`);
            // Treat as single-day event
            weekdayDisplayDe = weekdayNamesFull.de[eventDate.getDay()];
            weekdayDisplayEn = weekdayNamesFull.en[eventDate.getDay()];
        } else {
            const endDay = endDate.getDate();
            const endMonth = monthNames[currentLanguage][endDate.getMonth()];
            
            // Format date range
            if (eventDate.getMonth() === endDate.getMonth()) {
                // Same month: "29-30 NOV"
                dateRangeDisplay = `${day}-${endDay}`;
            } else {
                // Different months: "29 NOV - 1 DEZ"
                dateRangeDisplay = `${day} ${month} - ${endDay} ${endMonth}`;
            }
            
            // Get weekday range for both languages (abbreviated)
            const startWeekdayDe = weekdayNamesShort.de[eventDate.getDay()];
            const endWeekdayDe = weekdayNamesShort.de[endDate.getDay()];
            const startWeekdayEn = weekdayNamesShort.en[eventDate.getDay()];
            const endWeekdayEn = weekdayNamesShort.en[endDate.getDay()];
            weekdayDisplayDe = `${startWeekdayDe} - ${endWeekdayDe}`;
            weekdayDisplayEn = `${startWeekdayEn} - ${endWeekdayEn}`;
        }
    } else {
        // Single day event
        weekdayDisplayDe = weekdayNamesFull.de[eventDate.getDay()];
        weekdayDisplayEn = weekdayNamesFull.en[eventDate.getDay()];
    }
    
    // Build date display HTML
    let dateDisplayHTML;
    if (isMultiDay && endDate && eventDate.getMonth() !== endDate.getMonth()) {
        // Different months - show full range in text
        dateDisplayHTML = `
            <div class="event-date multi-day">
                <span class="date-range">${dateRangeDisplay}</span>
            </div>
        `;
    } else if (isMultiDay && endDate) {
        // Same month - show range with month
        dateDisplayHTML = `
            <div class="event-date multi-day">
                <span class="day-range">${dateRangeDisplay}</span>
                <span class="month">${month}</span>
            </div>
        `;
    } else {
        // Single day
        dateDisplayHTML = `
            <div class="event-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
        `;
    }
    
    card.innerHTML = `
        ${dateDisplayHTML}
        <div class="event-info">
            <h3 class="multilang" data-de="${event.title.de}" data-en="${event.title.en}">${event.title[currentLanguage]}</h3>
            <p class="event-weekday multilang" data-de="${weekdayDisplayDe}" data-en="${weekdayDisplayEn}">${weekdayDisplayDe}</p>
            <p class="event-time">⏰ ${event.startTime} - ${event.endTime}</p>
            <p class="event-location">📍 <span class="multilang" data-de="${event.location.de}" data-en="${event.location.en}">${event.location[currentLanguage]}</span></p>
            <p class="event-description multilang" 
               data-de="${event.description.de}" 
               data-en="${event.description.en}">
               ${event.description[currentLanguage]}
            </p>
        </div>
    `;
    
    return card;
}
