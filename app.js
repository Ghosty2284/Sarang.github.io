// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typewriterElement = document.getElementById('typewriter');
const particlesContainer = document.getElementById('particles');
const contactForm = document.getElementById('contact-form');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
});

// Typewriter Effect
const typewriterText = 'Sarang Swami';
let typewriterIndex = 0;

function typeWriter() {
    if (typewriterIndex < typewriterText.length) {
        typewriterElement.textContent += typewriterText.charAt(typewriterIndex);
        typewriterIndex++;
        setTimeout(typeWriter, 150);
    } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
            typewriterElement.style.borderRight = 'none';
        }, 1000);
    }
}

// Start typewriter effect after loading
setTimeout(typeWriter, 1500);

// Particle Animation System
function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Navigation Functionality - Improved
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavigation() {
    const currentScrollY = window.scrollY;
    
    // Navbar background on scroll
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link - improved responsiveness
    updateActiveNavLink();
    
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavigation);
        ticking = true;
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Improved active navigation link updating
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150; // Adjusted for better responsiveness
    
    let currentActiveSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentActiveSection = sectionId;
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveSection}`) {
            link.classList.add('active');
        }
    });
}

// Optimized Intersection Observer for animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add slight delay for smoother animations
            setTimeout(() => {
                entry.target.classList.add('animate');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }, 100);
        }
    });
}, observerOptions);

// Observe elements for animations
const animateElements = document.querySelectorAll([
    '.timeline-item',
    '.project-card',
    '.skill-category',
    '.certification-card'
].join(','));

animateElements.forEach(element => {
    observer.observe(element);
});

// Skill bar animations
function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const skillLevel = bar.getAttribute('data-skill');
        bar.style.setProperty('--skill-width', skillLevel + '%');
        
        setTimeout(() => {
            bar.classList.add('animate');
        }, 200 + (index * 100)); // Stagger animation
    });
}

// Enhanced Contact Form Validation and Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous validation messages
    clearValidationMessages();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim();
    const message = formData.get('message').trim();
    
    let isValid = true;
    
    // Enhanced validation with better error messages
    if (!name) {
        showFieldError('name', 'Name is required');
        isValid = false;
    }
    
    if (!email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!subject) {
        showFieldError('subject', 'Subject is required');
        isValid = false;
    }
    
    if (!message) {
        showFieldError('message', 'Message is required');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please fix the errors below.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.add('success');
        setTimeout(() => {
            submitButton.classList.remove('success');
        }, 2000);
    }, 2000);
});

// Enhanced field error display
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const fieldContainer = field.parentElement;
    
    // Remove existing error message
    const existingError = fieldContainer.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling to field
    field.classList.add('error');
    
    // Create and add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'field-error';
    errorMessage.textContent = message;
    fieldContainer.appendChild(errorMessage);
    
    // Remove error styling on focus
    field.addEventListener('focus', () => {
        field.classList.remove('error');
        const errorMsg = fieldContainer.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    }, { once: true });
}

function clearValidationMessages() {
    const errorMessages = document.querySelectorAll('.field-error');
    const errorFields = document.querySelectorAll('.form-control.error');
    
    errorMessages.forEach(msg => msg.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        line-height: 1.4;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
const scrollToTopButton = document.createElement('button');
scrollToTopButton.innerHTML = '↑';
scrollToTopButton.className = 'scroll-to-top';
scrollToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-btn-primary-text);
    border: none;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    z-index: 1000;
    transition: all 0.3s ease;
    opacity: 0;
    transform: scale(0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

scrollToTopButton.addEventListener('click', scrollToTop);
document.body.appendChild(scrollToTopButton);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.transform = 'scale(1)';
    } else {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.transform = 'scale(0.8)';
    }
});

// Enhanced hover effects for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Interactive tech tags
const techTags = document.querySelectorAll('.tech-tag');
techTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.style.transform = 'scale(1.1)';
        setTimeout(() => {
            tag.style.transform = 'scale(1)';
        }, 200);
    });
});

// Floating animation for hero icons
const floatingIcons = document.querySelectorAll('.floating-icon');
floatingIcons.forEach((icon, index) => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2) translateY(-10px)';
        icon.style.boxShadow = '0 10px 25px rgba(50, 184, 198, 0.3)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) translateY(0)';
        icon.style.boxShadow = 'none';
    });
});

// Optimized parallax effect for hero section
const heroSection = document.querySelector('.hero');
const circuitPattern = document.querySelector('.circuit-pattern');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3; // Reduced for better performance
    
    if (circuitPattern && scrolled < window.innerHeight) {
        circuitPattern.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic skill percentage display
const skillBars = document.querySelectorAll('.skill-progress');
skillBars.forEach(bar => {
    const skillLevel = bar.getAttribute('data-skill');
    
    // Create percentage display
    const percentageDisplay = document.createElement('span');
    percentageDisplay.textContent = skillLevel + '%';
    percentageDisplay.style.cssText = `
        position: absolute;
        right: 0;
        top: -25px;
        font-size: 12px;
        color: var(--color-text-secondary);
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    bar.parentElement.style.position = 'relative';
    bar.parentElement.appendChild(percentageDisplay);
    
    // Show percentage on hover
    bar.parentElement.addEventListener('mouseenter', () => {
        percentageDisplay.style.opacity = '1';
    });
    
    bar.parentElement.addEventListener('mouseleave', () => {
        percentageDisplay.style.opacity = '0';
    });
});

// Enhanced timeline item hover effects
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    const marker = item.querySelector('.timeline-marker');
    
    item.addEventListener('mouseenter', () => {
        marker.style.transform = 'translateX(-50%) scale(1.3)';
        marker.style.boxShadow = '0 0 20px rgba(50, 184, 198, 0.5)';
    });
    
    item.addEventListener('mouseleave', () => {
        marker.style.transform = 'translateX(-50%) scale(1)';
        marker.style.boxShadow = 'none';
    });
});

// Course tag interactions
const courseTags = document.querySelectorAll('.course-tag');
courseTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = tag.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        tag.style.position = 'relative';
        tag.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Certification card flip effect
const certificationCards = document.querySelectorAll('.certification-card');
certificationCards.forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
            card.style.transform = 'rotateY(0deg)';
        }, 600);
    });
});

// Contact form input focus effects
const formControls = document.querySelectorAll('.form-control');
formControls.forEach(control => {
    control.addEventListener('focus', () => {
        control.parentElement.style.transform = 'scale(1.01)';
    });
    
    control.addEventListener('blur', () => {
        control.parentElement.style.transform = 'scale(1)';
    });
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animation class to elements
    const animatedElements = document.querySelectorAll([
        '.hero-text',
        '.about-content',
        '.section-header'
    ].join(','));
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Smooth reveal animation for sections
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Console welcome message
console.log(`
🚀 Welcome to Sarang Swami's Portfolio!
📧 Contact: swamisarang70@gmail.com
🔗 LinkedIn: linkedin.com/in/sarangLinkedln
💻 GitHub: github.com/Ghosty2284

Built with modern web technologies and lots of ⚡
`);

// Add success button styles
const successButtonStyle = document.createElement('style');
successButtonStyle.textContent = `
    .btn.success {
        background: var(--color-success) !important;
        transform: scale(1.02);
    }
    
    .btn.success::after {
        content: '✓';
        margin-left: 10px;
    }
    
    .form-control.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .field-error {
        color: #ef4444;
        font-size: 12px;
        margin-top: 5px;
        font-weight: 500;
        display: block;
    }
`;
document.head.appendChild(successButtonStyle);