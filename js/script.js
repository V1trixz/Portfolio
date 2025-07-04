// Verificação de login
function checkLogin() {
    const isLoggedIn = localStorage.getItem('portfolioLoggedIn');
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas

    if (!isLoggedIn || !loginTime || (currentTime - parseInt(loginTime)) > sessionDuration) {
        // Limpar dados de login expirados
        localStorage.removeItem('portfolioLoggedIn');
        localStorage.removeItem('loginTime');
        
        // Redirecionar para login
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Verificar login ao carregar a página
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (!checkLogin()) {
        // Se não estiver logado, parar execução do resto do script
        throw new Error('Redirecionando para login');
    }
}

// Smooth scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Gallery modal functionality
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const closeModal = document.querySelector('.close');

// Open modal when gallery item is clicked
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        const description = item.getAttribute('data-description');
        
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = overlay.querySelector('h3').textContent;
        modalText.textContent = description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-item, .gallery-item, .section-title').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Smooth reveal animation for gallery items
function revealGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Trigger gallery animation when section is visible
const gallerySection = document.querySelector('.gallery');
if (gallerySection) {
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealGalleryItems();
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    galleryObserver.observe(gallerySection);
}

// Add hover sound effect (optional - can be enabled with audio files)
function addHoverSounds() {
    const interactiveElements = document.querySelectorAll('.cta-button, .gallery-item, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Subtle visual feedback
            element.style.transition = 'all 0.2s ease';
        });
    });
}

// Initialize hover effects
addHoverSounds();

// Cursor trail effect (optional enhancement)
function createCursorTrail() {
    const trail = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, ${1 - i / trailLength});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    document.addEventListener('mousemove', (e) => {
        trail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
            }, index * 20);
        });
    });
}

// Initialize cursor trail (uncomment to enable)
// createCursorTrail();

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations here
}, 16)); // ~60fps

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Fade in animation for all elements
    const elements = document.querySelectorAll('section, .nav');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Set initial states for animations
    const animatedElements = document.querySelectorAll('section, .nav');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });
});

