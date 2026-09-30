const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#primary-navigation');
const languagePreferenceKey = 'c-ai-language';

function setMenuOpen(open: boolean) {
  if (!menuToggle || !navigation) return;

  const language = document.documentElement.lang === 'en' ? 'En' : 'Es';
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.dataset.open = String(open);
  menuToggle.textContent = open
    ? menuToggle.dataset[`close${language}`] ?? 'Cerrar'
    : menuToggle.dataset[document.documentElement.lang] ?? 'Menú';
}

function applyLanguage(language: 'es' | 'en') {
  const locale = language === 'es' ? 'Es' : 'En';

  document.documentElement.lang = language;
  document.title = 'C-AI — Contextualized Artificial Intelligence';
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    language === 'es'
      ? 'C-AI, grupo de investigación en inteligencia artificial contextualizada de FaMAF, Universidad Nacional de Córdoba.'
      : 'C-AI, a contextualized artificial intelligence research group at FaMAF, National University of Córdoba.',
  );

  document.querySelectorAll<HTMLElement>('[data-es][data-en]').forEach((element) => {
    element.textContent = element.dataset[language] ?? '';
  });
  document.querySelectorAll<HTMLElement>('[data-aria-es][data-aria-en]').forEach((element) => {
    element.setAttribute('aria-label', element.dataset[`aria${locale}`] ?? '');
  });
  document.querySelectorAll<HTMLElement>('[data-roledescription-es][data-roledescription-en]').forEach((element) => {
    element.setAttribute('aria-roledescription', element.dataset[`roledescription${locale}`] ?? '');
  });
  document.querySelectorAll<HTMLImageElement>('[data-alt-es][data-alt-en]').forEach((image) => {
    image.alt = image.dataset[`alt${locale}`] ?? '';
  });

  if (languageToggle) {
    languageToggle.setAttribute('aria-label', languageToggle.dataset[`label${locale}`] ?? '');
    languageToggle.title = languageToggle.dataset[`title${locale}`] ?? '';
  }
  setMenuOpen(false);
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

const languageToggle = document.querySelector<HTMLButtonElement>('.locale-toggle');

const savedLanguage = window.localStorage.getItem(languagePreferenceKey);
if (savedLanguage === 'es' || savedLanguage === 'en') {
  applyLanguage(savedLanguage);
}

languageToggle?.addEventListener('click', () => {
  const language = document.documentElement.lang === 'es' ? 'en' : 'es';
  window.localStorage.setItem(languagePreferenceKey, language);
  applyLanguage(language);
});
