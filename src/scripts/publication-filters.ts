const personFilter = document.querySelector<HTMLInputElement>('#publication-person');
const yearFilter = document.querySelector<HTMLSelectElement>('#publication-year');
const publicationItems = [...document.querySelectorAll<HTMLElement>('[data-publication-item]')];
const emptyState = document.querySelector<HTMLElement>('[data-publication-empty]');

function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();
}

function filterPublications() {
  if (!personFilter || !yearFilter) return;

  const person = normalize(personFilter.value.trim());
  const year = yearFilter.value;
  let visibleCount = 0;

  publicationItems.forEach((item) => {
    const authors = normalize(item.dataset.authors ?? '');
    const matchesPerson = !person || authors.includes(person);
    const matchesYear = !year || item.dataset.year === year;
    const visible = matchesPerson && matchesYear;

    item.classList.toggle('is-filtered-out', !visible);
    if (visible) visibleCount += 1;
  });

  if (emptyState) emptyState.hidden = visibleCount > 0;
}

personFilter?.addEventListener('input', filterPublications);
yearFilter?.addEventListener('change', filterPublications);
