function impressumAddressSpacing() {
    document.querySelectorAll('.legal-content .address-block').forEach(function (p) {
        // split on <br>, keeping text nodes intact
        // use innerHTML split to preserve any HTML inside lines
        const parts = p.innerHTML.split(/<br\s*\/?>/i);
        const newHtml = parts.map(part => {
          return '<span class="addr-line">' + part.trim() + '</span>';
        }).join('');
        p.innerHTML = newHtml;
    });
}