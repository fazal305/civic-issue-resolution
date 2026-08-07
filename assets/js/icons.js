/*
  CivicConnect Icon Library

  A small hand-authored outline-icon set (24x24, stroke-based) used in
  place of emoji throughout the app. CIVIC_ICONS holds the inner SVG
  markup for each icon name; civicIcon() wraps it in a full <svg> tag
  for use inside jQuery-built template strings (toasts, notifications,
  empty states, etc.). Static HTML pages inline the same markup directly.
*/

let CIVIC_ICONS = {
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z"/>',

  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',

  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8Z"/><path d="M10 18a2 2 0 0 0 4 0"/>',

  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',

  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',

  droplet: '<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z"/>',

  flame: '<path d="M12 2s5 4.2 5 9.2a5 5 0 0 1-10 0C7 8.5 8 6.5 9 5.2c.2 1.4 1 2 1 2C10 5 10.5 3.3 12 2Z"/>',

  road: '<path d="M8 3 4 21M16 3l4 18M12 6v2.5M12 12v2.5M12 18v1.5"/>',

  robot: '<rect x="5" y="9" width="14" height="10" rx="2.5"/><path d="M12 5v4"/><circle cx="12" cy="4" r="1.1"/><circle cx="9.3" cy="14" r="1"/><circle cx="14.7" cy="14" r="1"/><path d="M9 18h6"/>',

  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',

  building: '<path d="M5 21V10l7-5 7 5v11"/><path d="M4 21h16"/><path d="M9 21v-6h6v6"/>',

  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none"/>',

  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 7 18h2M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8 3 3 0 0 1-2 5.2h-2M9 4v14M15 4v14"/>',

  lightbulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6V16h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"/>',

  phone: '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.3-.3c1.2.4 2.5.6 3.9.6a1.2 1.2 0 0 1 1.2 1.2V20a1.2 1.2 0 0 1-1.2 1.2C10.7 21.2 2.8 13.3 2.8 3.7A1.2 1.2 0 0 1 4 2.5h3.3a1.2 1.2 0 0 1 1.2 1.2c0 1.4.2 2.7.6 3.9.1.4 0 .9-.3 1.2Z"/>',

  clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h6"/>',

  "paper-plane": '<path d="M21 3 3 10.5l7 2.5"/><path d="M21 3 13.5 21l-2.5-8"/><path d="M21 3 10.5 12.5"/>',

  link: '<path d="M10 14a4 4 0 0 0 5.7.3l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.4"/><path d="M14 10a4 4 0 0 0-5.7-.3l-3 3a4 4 0 0 0 5.7 5.7l1.4-1.4"/>',

  "map-pin": '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',

  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.3"/><path d="M15.2 13a5 5 0 0 1 5.8 5"/>',

  layers: '<path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M2 13l10 5 10-5"/><path d="M2 18l10 5 10-5"/>',

  rocket: '<path d="M12 2c3 1 5 4 5 8 0 3-1.5 5.5-3 7l-2 2-2-2c-1.5-1.5-3-4-3-7 0-4 2-7 5-8Z"/><circle cx="12" cy="9" r="1.4"/><path d="M9 17l-2 4M15 17l2 4"/>',

  camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13.5" r="3.3"/>',

  "bar-chart": '<rect x="4" y="12" width="3.2" height="8"/><rect x="10.4" y="6" width="3.2" height="14"/><rect x="16.8" y="9" width="3.2" height="11"/>',

  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',

  smartphone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',

  inbox: '<path d="M4 12h4l2 3h4l2-3h4"/><path d="M5 12 4 5h16l-1 7"/><path d="M5 12v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',

  check: '<path d="M5 12.5 10 17.5 20 6.5"/>',

  "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8 12.5 11 15.5 16 9"/>',

  "alert-triangle": '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10.5v4.2"/><circle cx="12" cy="17.4" r="0.9" fill="currentColor" stroke="none"/>',

  "x-circle": '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',

  "info-circle": '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none"/>',

  "file-text": '<path d="M7 3h7l4 4v14H7Z"/><path d="M14 3v4h4"/><path d="M9.5 12h5M9.5 15.5h5"/>',

  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',

  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.2 8.1 4 4 0 0 1 17 16H7Z"/>',
};

function civicIcon(name, extraClass) {
  let markup = CIVIC_ICONS[name];

  if (!markup) {
    return "";
  }

  let className = "civic-icon" + (extraClass ? " " + extraClass : "");

  return (
    '<svg class="' +
    className +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    markup +
    "</svg>"
  );
}
