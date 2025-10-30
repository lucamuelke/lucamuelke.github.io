// Events Module - Event Loading and Rendering

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
            const month = monthNames[getCurrentLanguage()][eventDate.getMonth()];
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
        const response = await fetch('data/events.json', {
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
        eventsContainer.innerHTML = '<p class="error multilang" data-de="Fehler beim Laden der Events" data-en="Error loading events">Error loading events</p>';
    }
}

// Generate all events (manual + recurring)
function generateAllEvents(data) {
    const now = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

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
            while (currentDate <= twoMonthsFromNow) {
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
    const month = monthNames[getCurrentLanguage()][eventDate.getMonth()];
    
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
            const endMonth = monthNames[getCurrentLanguage()][endDate.getMonth()];
            
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
            <h3 class="multilang" data-de="${event.title.de}" data-en="${event.title.en}">${event.title[getCurrentLanguage()]}</h3>
            <p class="event-weekday multilang" data-de="${weekdayDisplayDe}" data-en="${weekdayDisplayEn}">${weekdayDisplayDe}</p>
            <p class="event-time">⏰ ${event.startTime} - ${event.endTime}</p>
            <p class="event-location"><span class="location-icon">📍</span><span class="multilang" data-de="${event.location.de}" data-en="${event.location.en}">${event.location[getCurrentLanguage()]}</span></p>
            <p class="event-description multilang" 
               data-de="${event.description.de}" 
               data-en="${event.description.en}">
               ${event.description[getCurrentLanguage()]}
            </p>
        </div>
    `;
    
    return card;
}
