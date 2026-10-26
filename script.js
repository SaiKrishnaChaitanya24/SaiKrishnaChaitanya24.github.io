// Minimal, dependency-free enhancements for this static GitHub Pages website.
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    siteNav.classList.toggle('open', !isOpen);
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('open');
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      siteNav.classList.remove('open');
    }
  });
}

const filters = [...document.querySelectorAll('.filter-button')];
const publications = [...document.querySelectorAll('.publication-item')];
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  publications.forEach(item => { item.hidden = filter !== 'all' && item.dataset.kind !== filter; });
}));

const citation = 'Annavazala, S. K. C., Parker, D., Broomand Lomer, N., & Verma, R. (2026). Diciphr processing pipeline for Diffusion and T1 MRI (Version 1.0.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.23603568';
const copyCitation = document.querySelector('[data-copy-citation]');
const citationFeedback = document.querySelector('.citation-feedback');
copyCitation?.addEventListener('click', async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(citation);
    } else {
      const field = document.createElement('textarea');
      field.value = citation;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      if (!document.execCommand('copy')) throw new Error('Copy unsupported');
      field.remove();
    }
    citationFeedback.textContent = 'Citation copied to clipboard.';
  } catch {
    citationFeedback.textContent = 'Copy unavailable. Use the citation on Zenodo.';
  }
});

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());


// Slide-out CV preview, using the native dialog for keyboard accessibility.
const cvDialog = document.getElementById('cv-dialog');
if (cvDialog) {
  const cvTriggers = document.querySelectorAll('[data-open-cv]');
  cvTriggers.forEach(trigger => trigger.addEventListener('click', event => {
    if (typeof cvDialog.showModal !== 'function') return; // PDF link fallback
    event.preventDefault();
    if (!cvDialog.open) cvDialog.showModal();
    // Close the mobile menu if it was open.
    menuToggle?.setAttribute('aria-expanded','false');
    siteNav?.classList.remove('open');
  }));
  cvDialog.querySelector('[data-close-cv]')?.addEventListener('click', () => cvDialog.close());
  cvDialog.addEventListener('click', event => {
    // Clicking the darkened backdrop (not the drawer content) closes the viewer.
    if (event.target !== cvDialog) return;
    const bounds = cvDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) cvDialog.close();
  });
}
