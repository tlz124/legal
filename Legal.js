// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in effect to sections
const sections = document.querySelectorAll('.practice-card, .team-card, .stat-item, .info-item');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            submitButton.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            
            // Show success message
            showNotification('Thank you for contacting Sterling & Associates. We will review your inquiry and respond within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = 'linear-gradient(135deg, var(--gold-accent) 0%, var(--rich-mahogany) 100%)';
            }, 3000);
        }, 1500);
    });
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease;
        max-width: 400px;
        font-size: 0.95rem;
        line-height: 1.5;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Stats counter animation
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isCurrency = target.includes('$');
        const hasPlus = target.includes('+');
        
        // Extract number
        let numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
        
        // Animation
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            
            // Format based on type
            if (isCurrency) {
                if (numericValue >= 1000) {
                    displayValue = (current / 1000).toFixed(1) + 'B';
                }
                counter.textContent = '$' + displayValue + (hasPlus ? '+' : '');
            } else if (isPercentage) {
                counter.textContent = displayValue + '%';
            } else {
                counter.textContent = displayValue + (hasPlus ? '+' : '');
            }
        }, 30);
    });
};

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 1.5;
    }
});

// Video parallax and scroll-based playback
const parallaxVideo = document.querySelector('.parallax-video');
const videoSection = document.querySelector('.video-section');

if (parallaxVideo && videoSection) {
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }

    // Video scroll parallax effect
    window.addEventListener('scroll', () => {
        if (isInViewport(videoSection)) {
            const rect = videoSection.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            
            // Parallax effect - slower scroll speed
            const yPos = -(scrollPercent * 30);
            parallaxVideo.style.transform = `translateX(-50%) translateY(calc(-50% + ${yPos}px))`;
            
            // Play video when in viewport
            if (parallaxVideo.paused) {
                parallaxVideo.play().catch(err => console.log('Video play failed:', err));
            }
        } else {
            // Pause video when out of viewport to save resources
            if (!parallaxVideo.paused) {
                parallaxVideo.pause();
            }
        }
    });
}

// Hero video optimization
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    // Ensure hero video plays
    heroVideo.play().catch(err => console.log('Hero video play failed:', err));
    
    // Slow down hero video when scrolling down
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            const opacity = 1 - (scrolled / window.innerHeight);
            heroVideo.style.opacity = opacity;
        }
    });
}

// Form validation
const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = 'rgba(231, 76, 60, 0.5)';
        } else {
            input.style.borderColor = 'rgba(46, 204, 113, 0.5)';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--gold-accent)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }, 250);
});

// Disable right-click on images (optional security feature)
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Console message for developers
console.log('%c Sterling & Associates', 'font-size: 24px; font-weight: bold; color: #D4AF37;');
console.log('%c Excellence in Corporate Law Since 1994', 'font-size: 14px; color: #9E9E9E;');
console.log('%c Built with precision and attention to detail', 'font-size: 12px; color: #6B3410; font-style: italic;');
