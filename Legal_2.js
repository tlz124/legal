// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Smooth scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            resetHamburger();
        }
    });
});

// ===== Mobile menu =====
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const mobileClose  = document.getElementById('mobileMenuClose');

function resetHamburger() {
    if (!hamburger) return;
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = 'none';
}

if (hamburger) {
    hamburger.addEventListener('click', function () {
        mobileMenu.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    });
}

if (mobileClose) {
    mobileClose.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        resetHamburger();
    });
}

document.addEventListener('click', function (e) {
    if (
        mobileMenu &&
        mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        e.target !== hamburger
    ) {
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        resetHamburger();
    }
});

// ===== Contact form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('.form-submit');
        const original = btn.textContent;
        btn.textContent = 'Message Sent';
        btn.style.background = '#8a9a6a';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            btn.disabled = false;
            this.reset();
        }, 3500);
    });
}

// ===== Scroll fade-in animations =====
const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    fadeEls.forEach(el => observer.observe(el));
} else {
    fadeEls.forEach(el => el.classList.add('visible'));
}

// ===== Annotation Toggle =====
const annotationToggle = document.getElementById('annotationToggle');

if (annotationToggle) {
    annotationToggle.addEventListener('click', function () {
        const isOff = document.body.classList.contains('annotations-off');
        const stateLabel = annotationToggle.querySelector('.toggle-state');
        const mainLabel  = annotationToggle.querySelector('.toggle-label');

        if (isOff) {
            // Turn ON
            document.body.classList.remove('annotations-off');
            document.body.classList.add('annotations-on');
            mainLabel.textContent  = 'Hide Tier Features';
            stateLabel.textContent = 'ON';
            stateLabel.style.color = 'rgba(185,122,255,0.8)';
        } else {
            // Turn OFF
            document.body.classList.remove('annotations-on');
            document.body.classList.add('annotations-off');
            mainLabel.textContent  = 'View Tier Features';
            stateLabel.textContent = 'OFF';
            stateLabel.style.color = '';
        }
    });
}
