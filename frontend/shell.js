// Automático sigue el tema de Streamlit; en la versión estática sigue al sistema.
const THEME_KEY = 'delivery-g4-theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let themePreference = 'auto';
try { themePreference = localStorage.getItem(THEME_KEY) || 'auto'; } catch (_) { /* almacenamiento opcional */ }
if (!['auto', 'light', 'dark'].includes(themePreference)) themePreference = 'auto';

function hostTheme() {
  try {
    if (window.parent !== window) {
      const host = window.parent.document.querySelector('[data-testid="stApp"]');
      if (host) {
        const rgb = window.parent.getComputedStyle(host).backgroundColor.match(/[\d.]+/g);
        if (rgb && (rgb.length < 4 || Number(rgb[3]) > 0)) {
          const brightness = Number(rgb[0]) * .2126 + Number(rgb[1]) * .7152 + Number(rgb[2]) * .0722;
          return brightness < 128 ? 'dark' : 'light';
        }
      }
    }
  } catch (_) { /* Un host de otro origen usa el tema del sistema. */ }
  return systemTheme.matches ? 'dark' : 'light';
}
function applyTheme() {
  const theme = themePreference === 'auto' ? hostTheme() : themePreference;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101b2c' : '#f4f7fb';
}
document.getElementById('theme-select').value = themePreference;
document.getElementById('theme-select').addEventListener('change', event => {
  themePreference = event.target.value;
  try { localStorage.setItem(THEME_KEY, themePreference); } catch (_) { /* sigue funcionando sin persistencia */ }
  applyTheme();
});
systemTheme.addEventListener('change', applyTheme);
try {
  if (window.parent !== window) {
    let pendingThemeUpdate = false;
    new MutationObserver(() => {
      if (themePreference !== 'auto' || pendingThemeUpdate) return;
      pendingThemeUpdate = true;
      requestAnimationFrame(() => { pendingThemeUpdate = false; applyTheme(); });
    }).observe(window.parent.document.documentElement, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style'],
    });
  }
} catch (_) { /* La lectura del padre puede estar restringida por el host. */ }
applyTheme();

const overlayOrigins = new Map();
function activeOverlay() {
  if (!document.getElementById('modal-backdrop').classList.contains('hidden')) return document.getElementById('modal');
  return document.getElementById('detail-drawer') || document.querySelector('.sidebar.is-open');
}
function syncOverlays() {
  const active = activeOverlay();
  const sidebar = document.getElementById('sidebar');
  const isNavigation = active === sidebar;
  document.body.classList.toggle('overlay-open', Boolean(active));
  document.querySelector('.app-shell').inert = Boolean(active && !isNavigation);
  document.getElementById('main-content').inert = isNavigation;
  const drawer = document.getElementById('detail-drawer');
  if (drawer) drawer.inert = Boolean(active && active !== drawer);
}
function activateOverlay(container) {
  overlayOrigins.set(container.id, document.activeElement);
  syncOverlays();
  container.querySelector('button, input, select, [tabindex="0"]')?.focus();
}
function releaseOverlay() {
  syncOverlays();
  // El último origen corresponde al diálogo que se acaba de cerrar.
  const entry = [...overlayOrigins.entries()].at(-1);
  if (!entry) return;
  overlayOrigins.delete(entry[0]);
  if (entry[1]?.isConnected && !entry[1].closest('[inert]')) entry[1].focus({ preventScroll: true });
}
function setNavigation(open, restoreFocus = true) {
  const sidebar = document.getElementById('sidebar');
  const wasOpen = sidebar.classList.contains('is-open');
  sidebar.classList.toggle('is-open', open);
  document.getElementById('navigation-backdrop').classList.toggle('hidden', !open);
  document.getElementById('menu-toggle').setAttribute('aria-expanded', String(open));
  syncOverlays();
  if (open) document.getElementById('menu-close').focus();
  else if (wasOpen && restoreFocus) document.getElementById('menu-toggle').focus();
}
document.getElementById('menu-toggle').addEventListener('click', () => setNavigation(true));
document.getElementById('menu-close').addEventListener('click', () => setNavigation(false));
document.getElementById('navigation-backdrop').addEventListener('click', () => setNavigation(false));
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) setNavigation(false, false); });
document.addEventListener('keydown', event => {
  const card = event.target.closest('[data-faq-id]');
  if (card && ['Enter', ' '].includes(event.key)) { event.preventDefault(); card.click(); }
  const overlay = activeOverlay();
  if (event.key !== 'Tab' || !overlay) return;
  const focusable = [...overlay.querySelectorAll('button:not(:disabled), input, select, textarea, [tabindex="0"], [contenteditable="true"]')]
    .filter(el => el.getClientRects().length && !el.closest('[inert]'));
  const first = focusable[0]; const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});
if(hosted){document.querySelector('.app-shell').inert=true;SmartClaimBridge.ready();}else render();
