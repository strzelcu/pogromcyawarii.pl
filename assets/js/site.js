const menu = document.querySelector('#menu-toggle');
menu?.addEventListener('click', () => { const expanded = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!expanded)); document.querySelector('#navigation').classList.toggle('open', !expanded); });
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => {menu.setAttribute('aria-expanded', 'false'); document.querySelector('#navigation').classList.remove('open');}));
document.querySelector('#enquiry')?.addEventListener('submit', event => { event.preventDefault(); const f = new FormData(event.target); const body = `Imię: ${f.get('name')}
Telefon: ${f.get('phone')}
Email: ${f.get('email')}
Problem dotyczy: ${f.getAll('category').join(', ')}
Model: ${f.get('model')}

${f.get('message')}`; document.querySelector('#form-status').textContent = 'Wyślij przygotowaną wiadomość w swoim programie pocztowym. Jeśli się nie otworzył, napisz na kontakt@pogromcyawarii.pl lub zadzwoń: 510 265 219.'; window.location.href = 'mailto:kontakt@pogromcyawarii.pl?subject=' + encodeURIComponent('Zgłoszenie — Pogromcy awarii') + '&body=' + encodeURIComponent(body); });
const slides = document.querySelector('#slides');
['prev','next'].forEach(direction => document.querySelector('#slide-' + direction)?.addEventListener('click', () => { const step = direction === 'next' ? 1 : -1; const index = Math.round(slides.scrollLeft / slides.clientWidth); const count = slides.children.length; slides.scrollTo({left: ((index + step + count) % count) * slides.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); }));
