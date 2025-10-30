# lucamuelke.github.io

Website for the BoulderING AG at TUHH (Technische Universität Hamburg).

## Project Structure

```
.
├── index.html          # Main landing page
├── events.html         # Events page
├── impressum.html      # Imprint/legal page
├── css/
│   ├── base/             # Global/shared styles
│   │   ├── base.css          # Reset, base styles, and main layout
│   │   ├── header.css        # Banner, navigation, language toggle
│   │   ├── components.css    # Reusable components (buttons, boxes, page-header)
│   │   ├── footer.css        # Footer styles
│   │   └── responsive.css    # Media queries and responsive design
│   └── pages/            # Page-specific styles
│       ├── index.css         # Index page specific styles
│       ├── events.css        # Events page specific styles
│       └── imprint.css       # Imprint page specific styles
├── js/
│   ├── core/             # Core/shared functionality
│   │   ├── language.js       # Language management (DE/EN toggle)
│   │   ├── header-footer.js  # Header and footer generation
│   │   └── main.js           # Main initialization
│   └── pages/            # Page-specific scripts
│       ├── events.js         # Event loading and rendering
│       └── imprint.js        # Imprint page specific logic
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

### Base Styles (css/base/)
Global styles used across all pages:
- **base.css**: Reset styles, body defaults, container layout, and main content wrapper
- **header.css**: Banner, navigation, logo, and language toggle styles
- **components.css**: Reusable UI components (buttons, info boxes, notices, page headers)
- **footer.css**: Footer layout and styling
- **responsive.css**: Media queries for mobile and tablet responsiveness

### Page-Specific Styles (css/pages/)
Styles specific to individual pages:
- **index.css**: Index page specific styles (hero, about sections, telegram section, contact section)
- **events.css**: Events page specific styles (event cards, event list, thursday notice)
- **imprint.css**: Imprint page specific styles (legal content)

## JavaScript Modules

### Core Modules (js/core/)
Shared functionality used across pages:
- **language.js**: Handles language switching and translation updates
- **header-footer.js**: Dynamically creates header navigation and footer
- **main.js**: Coordinates initialization of all modules

### Page-Specific Modules (js/pages/)
Scripts for individual pages:
- **events.js**: Loads events from data/events.json and renders event cards
- **imprint.js**: Imprint page specific logic (address spacing)