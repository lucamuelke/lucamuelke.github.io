# lucamuelke.github.io

Website for the BoulderING AG at TUHH (Technische Universität Hamburg).

## Project Structure

```
.
├── index.html          # Main landing page
├── events.html         # Events page
├── impressum.html      # Imprint/legal page
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   ├── language.js     # Language management (DE/EN toggle)
│   ├── layout.js       # Header and footer generation
│   ├── events.js       # Event loading and rendering
│   └── main.js         # Main initialization
├── assets/
│   └── *.svg           # Images, logos, and icons
└── data/
    └── events.json     # Event data (manual and recurring)
```

## Features

- **Bilingual Support**: Toggle between German (DE) and English (EN)
- **Dynamic Events**: Events loaded from JSON with support for:
  - Manual one-time events
  - Multi-day events
  - Recurring weekly events
- **Responsive Design**: Mobile-friendly layout
- **Modular JavaScript**: Organized code split into focused modules

## Development

This is a static website hosted on GitHub Pages. To test locally:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## JavaScript Modules

- **language.js**: Handles language switching and translation updates
- **layout.js**: Dynamically creates header navigation and footer
- **events.js**: Loads events from data/events.json and renders event cards
- **main.js**: Coordinates initialization of all modules