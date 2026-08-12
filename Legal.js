// Legal.js — Sterling & Chen Law Group

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  /* ---------------- Header scroll state ---------------- */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile hamburger menu ---------------- */
  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    if (primaryNav) {
      primaryNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          header.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Smooth in-page anchor scrolling ----------------
     For links that point at a section on THIS page (e.g. "#faq" or
     "index.html#faq" while already on index.html), intercept the
     click and glide there manually so behavior is consistent even
     on browsers/situations where CSS scroll-behavior is ignored. */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const [hrefPage, hash] = href.split('#');
    const targetsThisPage = hrefPage === '' || hrefPage === currentPage;
    if (!targetsThisPage || !hash) return;

    link.addEventListener('click', (e) => {
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${hash}`);
    });
  });

  // Landing on a page with a hash already in the URL (e.g. arrived from
  // another page's "#testimonials" link) — jump to it after layout settles.
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }

  /* ---------------- Active nav link highlighting ----------------
     Only whole-page links (Home / About / Services / Contact) get the
     persistent "current page" indicator. Links that point at a section
     of a page (e.g. "index.html#faq") are anchors, not separate pages,
     so they're excluded here to avoid multiple links lighting up at
     once on the same page. */
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes('#')) return;
    const linkPage = href || 'index.html';
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');

    const showStatus = (message, type) => {
      if (!status) return;
      status.textContent = message;
      status.className = `form-status visible ${type}`;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot: if this hidden field got filled in, silently drop it.
      const honeypot = form.querySelector('input[name="company"]');
      if (honeypot && honeypot.value.trim() !== '') return;

      const name = form.querySelector('#contactName');
      const email = form.querySelector('#contactEmail');
      const phone = form.querySelector('#contactPhone');
      const message = form.querySelector('#contactMessage');
      const service = form.querySelector('#contactService');

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim() || !email.value.trim() || !phone.value.trim() || !message.value.trim()) {
        showStatus('Please fill in your name, email, phone, and message before sending.', 'error');
        return;
      }

      if (!emailPattern.test(email.value.trim())) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      const subject = encodeURIComponent(`New Consultation Request from ${name.value.trim()}`);
      const bodyLines = [
        `Name: ${name.value.trim()}`,
        `Email: ${email.value.trim()}`,
        `Phone: ${phone.value.trim()}`,
        service && service.value ? `Practice Area: ${service.value}` : null,
        '',
        message.value.trim(),
      ].filter(Boolean);
      const body = encodeURIComponent(bodyLines.join('\n'));

      const mailtoLink = `mailto:info@sterlingchenlaw.com?subject=${subject}&body=${body}`;

      showStatus('Opening your email client with your message ready to send. If nothing opens, please email us directly at info@sterlingchenlaw.com.', 'success');
      window.location.href = mailtoLink;
    });
  }
});
