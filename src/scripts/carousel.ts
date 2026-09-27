const carousel = document.querySelector<HTMLElement>('.hero-carousel');

if (carousel) {
  const slides = [...carousel.querySelectorAll<HTMLImageElement>('[data-slide]')];
  let activeIndex = 0;

  function showNextSlide() {
    const currentSlide = slides[activeIndex];
    currentSlide.classList.remove('is-active');
    currentSlide.setAttribute('aria-hidden', 'true');

    slides[activeIndex].hidden = true;

    activeIndex = (activeIndex + 1) % slides.length;

    const nextSlide = slides[activeIndex];
    nextSlide.hidden = false;
    nextSlide.removeAttribute('aria-hidden');
    nextSlide.classList.add('is-active');
  }

  if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(showNextSlide, 5000);
  }
}
