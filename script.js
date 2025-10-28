// Language Management
let currentLanguage = 'de'; // Default language

// Load saved language preference
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Generate all events (manual + auto-generated)
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

// Generate all events (manual + auto-generated)
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
    
    // Generate auto events (Open Bouldering on Thursdays)
    if (data.autoEvents && data.autoEvents.openBouldering) {
        const autoEvent = data.autoEvents.openBouldering;
        const currentDate = new Date(now);
        currentDate.setHours(0, 0, 0, 0);
        
        // Generate events for the next month
        while (currentDate <= oneMonthFromNow) {
            // Check if it's Thursday (4 = Thursday)
            if (currentDate.getDay() === autoEvent.dayOfWeek) {
                const eventDateStr = currentDate.toISOString().split('T')[0];
                const eventDateTime = new Date(`${eventDateStr}T${autoEvent.startTime}`);
                
                // Check if this Thursday has a conflicting manual event
                const hasConflict = allEvents.some(manualEvent => {
                    return manualEvent.date === eventDateStr && !manualEvent.allowAutoEvent;
                });
                
                // Only add if no conflict or if event is in the future
                if (!hasConflict && eventDateTime >= now) {
                    allEvents.push({
                        date: eventDateStr,
                        startTime: autoEvent.startTime,
                        endTime: autoEvent.endTime,
                        title: autoEvent.title,
                        location: autoEvent.location,
                        description: autoEvent.description,
                        highlight: autoEvent.highlight,
                        type: 'auto',
                        dateTime: eventDateTime
                    });
                }
            }
            
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
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
            const weekdayNames = {
                de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            };
            weekdayDisplayDe = weekdayNames.de[eventDate.getDay()];
            weekdayDisplayEn = weekdayNames.en[eventDate.getDay()];
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
            
            // Get weekday range for both languages
            const weekdayNamesDe = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            const weekdayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const startWeekdayDe = weekdayNamesDe[eventDate.getDay()];
            const endWeekdayDe = weekdayNamesDe[endDate.getDay()];
            const startWeekdayEn = weekdayNamesEn[eventDate.getDay()];
            const endWeekdayEn = weekdayNamesEn[endDate.getDay()];
            weekdayDisplayDe = `${startWeekdayDe} - ${endWeekdayDe}`;
            weekdayDisplayEn = `${startWeekdayEn} - ${endWeekdayEn}`;
        }
    } else {
        // Single day event
        const weekdayNames = {
            de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        };
        weekdayDisplayDe = weekdayNames.de[eventDate.getDay()];
        weekdayDisplayEn = weekdayNames.en[eventDate.getDay()];
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
            <p class="event-weekday multilang" data-de="${weekdayDisplayDe}" data-en="${weekdayDisplayEn}">${currentLanguage === 'de' ? weekdayDisplayDe : weekdayDisplayEn}</p>
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
