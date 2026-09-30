(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#navigation');
  const closeMenu = () => {
    menu?.setAttribute('aria-expanded', 'false');
    navigation?.classList.remove('open');
  };
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    navigation?.classList.toggle('open', !expanded);
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });

  const slides = document.querySelector('#slides');
  const count = document.querySelector('#slide-count');
  if (slides) {
    const moveSlide = step => {
      const index = Math.round(slides.scrollLeft / slides.clientWidth);
      const next = (index + step + slides.children.length) % slides.children.length;
      slides.scrollTo({left: next * slides.clientWidth, behavior: reducedMotion.matches ? 'auto' : 'smooth'});
    };
    document.querySelector('#slide-prev')?.addEventListener('click', () => moveSlide(-1));
    document.querySelector('#slide-next')?.addEventListener('click', () => moveSlide(1));
    slides.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveSlide(event.key === 'ArrowLeft' ? -1 : 1);
    });
    slides.addEventListener('scroll', () => {
      const index = Math.round(slides.scrollLeft / slides.clientWidth) + 1;
      if (count) count.textContent = `${String(index).padStart(2, '0')} / ${String(slides.children.length).padStart(2, '0')}`;
    }, {passive: true});
  }

  if ('IntersectionObserver' in window) {
    if (!reducedMotion.matches) {
      const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      }), {threshold: 0.08});
      document.querySelectorAll('.section-heading, .wrap > h2, .about > p, .services article, .contact > div, .gallery').forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
      });
      document.body.classList.add('motion-ready');
      reducedMotion.addEventListener('change', event => {
        if (event.matches) document.body.classList.remove('motion-ready');
      });
    }
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation?.querySelectorAll('a').forEach(link => {
        const active = new URL(link.href).hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), {rootMargin: '-15% 0px -55% 0px'});
    document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
  }

  const galleryLinks = [...document.querySelectorAll('.gallery a')];
  const dialog = document.querySelector('#lightbox');
  const image = document.querySelector('#lightbox-image');
  let photoIndex = 0;
  let returnFocus;
  const showPhoto = index => {
    photoIndex = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[photoIndex];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    document.querySelector('#lightbox-title').textContent = image.alt;
    document.querySelector('#lightbox-count').textContent = `${photoIndex + 1} / ${galleryLinks.length}`;
  };
  if (dialog && typeof dialog.showModal === 'function') {
    galleryLinks.forEach((link, index) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = link;
      showPhoto(index);
      dialog.showModal();
      document.body.classList.add('modal-open');
      document.querySelector('#lightbox-close').focus();
    }));
    document.querySelector('#lightbox-close').addEventListener('click', () => dialog.close());
    document.querySelector('#lightbox-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
    document.querySelector('#lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      returnFocus?.focus({preventScroll: true});
    });
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
  }

  document.querySelector('#enquiry')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const body = `Imię: ${data.get('name')}\nTelefon: ${data.get('phone')}\nEmail: ${data.get('email')}\nProblem dotyczy: ${data.getAll('category').join(', ')}\nModel: ${data.get('model')}\n\n${data.get('message')}`;
    document.querySelector('#form-status').textContent = 'Wyślij przygotowaną wiadomość w swoim programie pocztowym. Jeśli się nie otworzył, napisz na kontakt@pogromcyawarii.pl lub zadzwoń: 510 265 219.';
    window.location.href = 'mailto:kontakt@pogromcyawarii.pl?subject=' + encodeURIComponent('Zgłoszenie — Pogromcy awarii') + '&body=' + encodeURIComponent(body);
  });
})();
