const carousels = document.querySelectorAll<HTMLElement>('.hero-carousel, .news-carousel');

carousels.forEach((carousel) => {
  const slides = [...carousel.querySelectorAll<HTMLImageElement>('[data-slide]')];
  let activeIndex = 0;

  if (slides.length < 2) return;

  function showSlide(nextIndex: number) {
    const currentSlide = slides[activeIndex];
    currentSlide.classList.remove('is-active');
    currentSlide.setAttribute('aria-hidden', 'true');
    currentSlide.hidden = true;

    activeIndex = (nextIndex + slides.length) % slides.length;

    const nextSlide = slides[activeIndex];
    nextSlide.hidden = false;
    nextSlide.removeAttribute('aria-hidden');
    nextSlide.classList.add('is-active');

    const status = carousel.querySelector<HTMLElement>('[data-carousel-status]');
    if (status) status.textContent = `${activeIndex + 1} / ${slides.length}`;
  }

  function showNextSlide() {
    showSlide(activeIndex + 1);
  }

  carousel.querySelector('[data-carousel-previous]')?.addEventListener('click', () => {
    showSlide(activeIndex - 1);
  });
  carousel.querySelector('[data-carousel-next]')?.addEventListener('click', showNextSlide);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(showNextSlide, 5000);
  }
});
