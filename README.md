# lucamuelke.github.io

Website for the BoulderING AG at TUHH (Technische Universität Hamburg).

## Project Structure

```
.
├── index.html          # Main landing page
├── events.html         # Events page
├── impressum.html      # Imprint/legal page
├── css/
│   ├── base.css          # Reset and base styles
│   ├── header.css        # Banner, navigation, language toggle
│   ├── layout.css        # Shared layout styles (main, page-header)
│   ├── components.css    # Reusable components (buttons, boxes)
│   ├── index.css         # Index page specific styles
│   ├── events.css        # Events page specific styles
│   ├── imprint.css       # Imprint page specific styles
│   ├── footer.css        # Footer styles
│   └── responsive.css    # Media queries and responsive design
├── js/
│   ├── language.js       # Language management (DE/EN toggle)
│   ├── header-footer.js  # Header and footer generation
│   ├── events.js         # Event loading and rendering
│   ├── imprint.js        # Imprint page specific logic
│   └── main.js           # Main initialization
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

## CSS Modules

- **base.css**: Reset styles, body defaults, and container layout
- **header.css**: Banner, navigation, logo, and language toggle styles
- **layout.css**: Shared layout styles used across multiple pages (main content wrapper, page headers)
- **components.css**: Reusable UI components (buttons, info boxes, notices)
- **index.css**: Index page specific styles (hero, about sections, telegram section, contact section)
- **events.css**: Events page specific styles (event cards, event list, thursday notice)
- **imprint.css**: Imprint page specific styles (legal content)
- **footer.css**: Footer layout and styling
- **responsive.css**: Media queries for mobile and tablet responsiveness

## JavaScript Modules

- **language.js**: Handles language switching and translation updates
- **header-footer.js**: Dynamically creates header navigation and footer
- **events.js**: Loads events from data/events.json and renders event cards
- **imprint.js**: Imprint page specific logic (address spacing)
- **main.js**: Coordinates initialization of all modules