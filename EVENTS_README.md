# Events Management Guide

This document explains how to manage events using the `events.json` file.

## Overview

The website now uses a dynamic events system where all events are defined in `events.json` and automatically rendered on the events page. The system supports both manual events and automatically generated recurring events.

## Event Types

### 1. Manual Events
Manual events are explicitly defined in the `events` array and are displayed until their end time has passed.

### 2. Auto-Generated Events
The system can automatically generate recurring events (like weekly "Open Bouldering" sessions). These are displayed for the next month only.

## File Structure: `events.json`

```json
{
  "events": [
    // Array of manual events
  ],
  "autoEvents": {
    // Configuration for auto-generated events
  }
}
```

## Adding a Manual Event

Add a new event object to the `events` array:

```json
{
  "date": "2025-12-15",
  "startTime": "18:00",
  "endTime": "20:00",
  "title": {
    "de": "German Title",
    "en": "English Title"
  },
  "location": {
    "de": "German Location",
    "en": "English Location"
  },
  "description": {
    "de": "German Description",
    "en": "English Description"
  },
  "highlight": false,
  "allowAutoEvent": false
}
```

### Field Descriptions

- **`date`** (required): Event date in `YYYY-MM-DD` format
- **`startTime`** (required): Start time in `HH:MM` format (24-hour)
- **`endTime`** (required): End time in `HH:MM` format (24-hour)
- **`title`** (required): Event title with `de` (German) and `en` (English) translations
- **`location`** (required): Location with `de` and `en` translations
- **`description`** (required): Description with `de` and `en` translations
- **`highlight`** (optional): Set to `true` to make the event stand out with special styling
- **`allowAutoEvent`** (optional, default: `false`): 
  - `false`: If this manual event is on a Thursday, it will suppress the auto-generated "Open Bouldering" event
  - `true`: Both the manual event and auto-generated event will be shown

## Auto-Generated Events Configuration

Currently configured to generate "Open Bouldering" events every Thursday:

```json
"autoEvents": {
  "openBouldering": {
    "dayOfWeek": 4,
    "startTime": "19:00",
    "endTime": "23:00",
    "title": {
      "de": "Open Bouldering",
      "en": "Open Bouldering"
    },
    "location": {
      "de": "Nordwandhalle, Zum Handweiser 15, 21129 Hamburg",
      "en": "Nordwandhalle, Zum Handweiser 15, 21129 Hamburg"
    },
    "description": {
      "de": "Unser regelmäßiges Open Bouldering für alle Levels. Komm vorbei und klettere mit uns!",
      "en": "Our regular open bouldering session for all levels. Come by and climb with us!"
    },
    "highlight": false
  }
}
```

### Auto-Event Field Descriptions

- **`dayOfWeek`**: Day of the week (0 = Sunday, 1 = Monday, ..., 4 = Thursday, ..., 6 = Saturday)
- **`startTime`**, **`endTime`**, **`title`**, **`location`**, **`description`**: Same as manual events
- **`highlight`**: Same as manual events

## Event Display Rules

1. **Manual Events**: Displayed until their end time has passed (no matter how far in the future)
2. **Auto-Generated Events**: Displayed for the next month only
3. **Conflict Resolution**: 
   - If a manual event falls on the same day as an auto-generated event and `allowAutoEvent: false`, only the manual event is shown
   - If `allowAutoEvent: true`, both events are shown

## Examples

### Example 1: Regular Event (Replaces Open Bouldering)
```json
{
  "date": "2025-11-07",
  "startTime": "18:00",
  "endTime": "21:00",
  "title": {
    "de": "Spezial Workshop",
    "en": "Special Workshop"
  },
  "location": {
    "de": "Kletterhalle",
    "en": "Climbing Gym"
  },
  "description": {
    "de": "Ein spezieller Workshop für Fortgeschrittene",
    "en": "A special workshop for advanced climbers"
  },
  "highlight": false,
  "allowAutoEvent": false
}
```
Result: On Thursday Nov 7, only the "Special Workshop" is shown (Open Bouldering is suppressed).

### Example 2: Additional Event (Alongside Open Bouldering)
```json
{
  "date": "2025-11-14",
  "startTime": "17:00",
  "endTime": "19:00",
  "title": {
    "de": "Anfängertraining",
    "en": "Beginner Training"
  },
  "location": {
    "de": "Nordwandhalle",
    "en": "Nordwandhalle"
  },
  "description": {
    "de": "Spezialtraining für Anfänger",
    "en": "Special training for beginners"
  },
  "highlight": false,
  "allowAutoEvent": true
}
```
Result: On Thursday Nov 14, both "Beginner Training" and "Open Bouldering" are shown.

### Example 3: Highlighted Event
```json
{
  "date": "2025-12-01",
  "startTime": "09:00",
  "endTime": "17:00",
  "title": {
    "de": "Jahresabschluss-Klettern",
    "en": "Year-End Climbing Trip"
  },
  "location": {
    "de": "Treffpunkt: Hauptbahnhof",
    "en": "Meeting point: Central Station"
  },
  "description": {
    "de": "Unser großer Jahresabschluss-Trip! Anmeldung erforderlich.",
    "en": "Our big year-end trip! Registration required."
  },
  "highlight": true,
  "allowAutoEvent": false
}
```
Result: This event appears with special highlighting to make it stand out.

## Maintenance Tips

1. **Regular Cleanup**: The system automatically hides events after their end time, but you may want to periodically remove old events from `events.json` to keep the file clean.

2. **Date Format**: Always use `YYYY-MM-DD` format for dates and `HH:MM` (24-hour) for times.

3. **Testing Changes**: After editing `events.json`, refresh the events page to see your changes immediately.

4. **Bilingual Content**: Always provide both German (`de`) and English (`en`) translations for all text fields.

## Troubleshooting

**Events not showing up?**
- Check that the date format is correct (`YYYY-MM-DD`)
- Verify that the event's end time hasn't passed
- Ensure the JSON syntax is valid (use a JSON validator if needed)

**Auto-events not generating?**
- Auto-events only generate for the next month
- Check that `dayOfWeek` is set correctly (0-6)
- Verify the `autoEvents` section is properly configured

**Language not switching?**
- Ensure all text fields have both `de` and `en` properties
- Check browser console for any JavaScript errors
