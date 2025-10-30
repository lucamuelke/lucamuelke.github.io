// Layout Module - Header and Footer Creation

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
                <img src="assets/Logo_BoulderING_V01-1.svg" alt="BoulderING AG Logo" class="logo-icon">
                <span class="logo-text">BoulderING AG</span>
            </a>
            <nav>
                <ul class="nav-links">
                    <li><a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''} data-de="Start" data-en="Home">Start</a></li>
                    <li><a href="events.html" ${currentPage === 'events.html' ? 'class="active"' : ''} data-de="Termine" data-en="Events">Termine</a></li>
                    <li><a href="imprint.html" ${currentPage === 'imprint.html' ? 'class="active"' : ''} data-de="Impressum" data-en="Imprint">Impressum</a></li>
                </ul>
            </nav>
            <button class="language-toggle" onclick="toggleLanguage()" aria-label="Toggle Language">
                <img id="flag" src="assets/flag-de.svg" alt="German Flag" class="flag-icon">
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
                <img src="assets/TUHH_logo_rgb.svg" alt="TUHH Logo" class="footer-logo">
            </a>
            <p class="footer-text">&copy; 2025 BoulderING AG | <a href="imprint.html" class="multilang" data-de="Impressum" data-en="Imprint">Impressum</a></p>
            <a href="https://www.asta.tuhh.de" target="_blank" rel="noopener noreferrer" class="footer-logo-right">
                <img src="assets/astaLogo.svg" alt="AStA Logo" class="footer-logo">
            </a>
        </div>
    `;
    
    document.body.appendChild(footer);
}
