// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure page loads on home section
    if (window.location.hash === '' || window.location.hash === '#') {
        window.location.hash = '#home';
    }
    
    // Initialize all functionality
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initProjectCarousel();
    initSkillBars();
    initContactForm();
    initScrollIndicator();
    initPathfindingMaze();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Handle mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Handle navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // On mobile (no navbar), scroll to exact position; on desktop, account for navbar
                const isMobile = window.innerWidth <= 768;
                const offsetTop = targetElement.offsetTop - (isMobile ? 0 : 70);
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Typing effect for hero section
function initTypingEffect() {
    const typingText = document.getElementById('typing-text');
    const texts = [
        'Computer Scientist',
        'Data-AI Student', 
        'Problem Solver',
        'Tech Enthusiast',
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    typeEffect();
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes and observe elements
    const animatedElements = [
        { selector: '.hero-text', animation: 'fade-in' },
        { selector: '.hero-visual', animation: 'scale-in' },
        { selector: '.about-text', animation: 'slide-in-left' },
        { selector: '.about-visual', animation: 'slide-in-right' },
        { selector: '.project-card', animation: 'fade-in' },
        { selector: '.timeline-item', animation: 'slide-in-left' },
        { selector: '.skill-category', animation: 'fade-in' },
        { selector: '.contact-info', animation: 'slide-in-left' },
        { selector: '.contact-form', animation: 'slide-in-right' }
    ];
    
    animatedElements.forEach(({ selector, animation }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add(animation);
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
}

// Project carousel functionality
function initProjectCarousel() {
    const projectsWrapper = document.getElementById('projectsWrapper');
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsContainer = document.querySelector('.projects-container');
    
    // Accessibility labels
    prevBtn.setAttribute('aria-label', 'Previous projects');
    nextBtn.setAttribute('aria-label', 'Next projects');
    
    let currentSlide = 0;
    let filteredProjects = [...projectCards];
    let activeFilter = 'all';
    let projectsPerSlide = 3;
    let gapPx = 28; // default sync with --carousel-gap
    let cardOuterWidth = 0; // width including gap (derived from computed width + gap)
    let totalSlides = 0;
    
    // Responsive projects per slide based on screen size
    function updateProjectsPerSlide() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            projectsPerSlide = 1; // Show 1 card on small mobile
        } else if (screenWidth <= 768) {
            projectsPerSlide = 2; // Show 2 cards on tablet
        } else {
            projectsPerSlide = 3; // Show 3 cards on desktop
        }
    }
    
    // Create indicators
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        totalSlides = Math.ceil(filteredProjects.length / projectsPerSlide);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === currentSlide) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Update carousel display
    function measureGap() {
        // Derive from computed styles (gap between first two visible cards) if available
        const style = getComputedStyle(projectsWrapper);
        const gapVal = style.columnGap || style.gap;
        if (gapVal) {
            const parsed = parseFloat(gapVal);
            if (!isNaN(parsed)) gapPx = parsed;
        }
    }

    function updateCarousel() {
        updateProjectsPerSlide();
        measureGap();
        
        // CSS handles exact 3-fit sizing via flex-basis. Just measure first visible card.
        const firstCard = filteredProjects.find(c => c.style.display !== 'none') || filteredProjects[0];
        let cardWidth = 0;
        if (firstCard) {
            const cs = getComputedStyle(firstCard);
            cardWidth = firstCard.getBoundingClientRect().width;
            // Include gap for translation except for last in a row
            cardOuterWidth = cardWidth + gapPx;
        }
        // Ensure all filtered are visible (CSS determines width)
        filteredProjects.forEach(card => {
            card.style.display = 'block';
            card.style.margin = '0';
            card.style.width = '';
        });
        // Hide non-filtered
        projectCards.forEach(card => {
            if (!filteredProjects.includes(card)) {
                card.style.display = 'none';
            }
        });
        
        // Bound currentSlide after filter/resize
        totalSlides = Math.ceil(filteredProjects.length / projectsPerSlide);
        if (currentSlide > totalSlides - 1) currentSlide = Math.max(0, totalSlides - 1);
        
    // Calculate the exact shift needed: 3 cards + 2 gaps between them
    // This ensures we shift by exactly one full "page" worth of content
    const pageWidth = (cardWidth * projectsPerSlide) + (gapPx * (projectsPerSlide ));
    const translateX = -(currentSlide * pageWidth);
        projectsWrapper.style.transform = `translateX(${translateX}px)`;
        
        // Update active indicator
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= totalSlides - 1;
        // Hide nav if not needed
        const navVisible = totalSlides > 1;
        prevBtn.style.visibility = navVisible ? 'visible' : 'hidden';
        nextBtn.style.visibility = navVisible ? 'visible' : 'hidden';
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        totalSlides = Math.ceil(filteredProjects.length / projectsPerSlide);
        currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        updateCarousel();
    }
    
    // Filter projects
    function filterProjects(category) {
        if (category === 'all') {
            filteredProjects = [...projectCards];
        } else {
            filteredProjects = [...projectCards].filter(card => 
                card.getAttribute('data-category') === category
            );
        }
        
        currentSlide = 0;
        createIndicators();
        updateCarousel();
    }
    
    // Navigation event listeners
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalSlides = Math.ceil(filteredProjects.length / projectsPerSlide);
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    });
    
    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            activeFilter = filter;
            filterProjects(filter);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    // Touch/swipe support with improved mobile handling
    let startX = 0;
    let endX = 0;
    let startTime = 0;
    let isDragging = false;
    
    projectsWrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startTime = Date.now();
        isDragging = true;
    }, { passive: true });
    
    projectsWrapper.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        // Allow scrolling vertically while swiping horizontally
        const currentX = e.touches[0].clientX;
        const diffX = Math.abs(currentX - startX);
        
        // If horizontal swipe is significant, prevent vertical scroll
        if (diffX > 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    projectsWrapper.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        const timeDiff = Date.now() - startTime;
        
        // Consider it a swipe if moved more than threshold pixels in less than 300ms
        if (Math.abs(diff) > threshold && timeDiff < 300) {
            if (diff > 0) {
                // Swipe left - next slide
                nextBtn.click();
            } else {
                // Swipe right - previous slide
                prevBtn.click();
            }
        }
    }
    
    // Handle window resize
    let resizeTO;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => {
            createIndicators();
            updateCarousel();
        }, 120);
    });
    
    // Auto-play functionality (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const totalSlides = Math.ceil(filteredProjects.length / projectsPerSlide);
            if (currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(0);
            }
        }, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pause auto-play on hover
    const projectsCarousel = document.querySelector('.projects-carousel');
    projectsCarousel.addEventListener('mouseenter', stopAutoPlay);
    projectsCarousel.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize after a short delay to ensure layout is ready
    setTimeout(() => {
        createIndicators();
        updateCarousel();
    }, 60);
    
    // startAutoPlay(); // Uncomment to enable auto-play
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 500);
                
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    // Check if form exists (it may have been replaced with a mailto link)
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<div class="loading"></div> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Reset button state
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitButton.style.background = 'var(--accent-color)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        }, 2000);
    });
}

// Scroll indicator functionality
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
    
    scrollIndicator.addEventListener('click', function() {
        const aboutSection = document.getElementById('about');
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : 'var(--primary-color)'};
        color: var(--text-primary);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-lg);
        box-shadow: 0 10px 25px var(--shadow-dark);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        max-width: 350px;
        backdrop-filter: blur(10px);
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: var(--font-size-lg);
        cursor: pointer;
        margin-left: var(--spacing-md);
        opacity: 0.7;
        transition: opacity var(--transition-normal);
    `;
    
    closeButton.addEventListener('mouseenter', () => closeButton.style.opacity = '1');
    closeButton.addEventListener('mouseleave', () => closeButton.style.opacity = '0.7');
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual close
    closeButton.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Parallax effect for floating cards
function initParallaxEffect() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        floatingCards.forEach((card, index) => {
            const yPos = -(scrolled * parallaxSpeed * (index + 1) * 0.1);
            card.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Add smooth hover effects for project cards
function initProjectHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize additional effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffect();
    initProjectHoverEffects();
});

// Add some Easter eggs for fun
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add rainbow animation to all gradient texts
    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        text.style.background = 'linear-gradient(45deg, #ff0000, #ff7700, #ffdd00, #00ff00, #0099ff, #6600ff, #ff0099)';
        text.style.backgroundSize = '400% 400%';
        text.style.animation = 'rainbow 2s ease infinite';
        text.style.webkitBackgroundClip = 'text';
        text.style.webkitTextFillColor = 'transparent';
    });
    
    // Add the rainbow animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
    
    showNotification('🎉 Konami Code activated! Rainbow mode enabled!', 'success');
    
    // Remove effect after 10 seconds
    setTimeout(() => {
        gradientTexts.forEach(text => {
            text.style.background = '';
            text.style.animation = '';
        });
        document.head.removeChild(style);
    }, 10000);
}

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
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// Add loading screen functionality
// function initLoadingScreen() {
//     const loadingScreen = document.createElement('div');
//     loadingScreen.id = 'loading-screen';
//     loadingScreen.innerHTML = `
//         <div class="loading-content">
//             <div class="loading-logo">MA</div>
//             <div class="loading-spinner"></div>
//             <p>Loading Portfolio...</p>
//         </div>
//     `;
    
//     loadingScreen.style.cssText = `
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: var(--bg-primary);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         z-index: 9999;
//         opacity: 1;
//         transition: opacity 0.5s ease-out;
//     `;
    
//     const loadingContent = loadingScreen.querySelector('.loading-content');
//     loadingContent.style.cssText = `
//         text-align: center;
//         color: var(--text-primary);
//     `;
    
//     const loadingLogo = loadingScreen.querySelector('.loading-logo');
//     loadingLogo.style.cssText = `
//         font-size: 3rem;
//         font-weight: 700;
//         background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
//         -webkit-background-clip: text;
//         -webkit-text-fill-color: transparent;
//         margin-bottom: 1rem;
//         animation: pulse 2s ease-in-out infinite;
//     `;
    
//     const loadingSpinner = loadingScreen.querySelector('.loading-spinner');
//     loadingSpinner.style.cssText = `
//         width: 40px;
//         height: 40px;
//         border: 3px solid var(--border-color);
//         border-top: 3px solid var(--primary-color);
//         border-radius: 50%;
//         animation: spin 1s linear infinite;
//         margin: 0 auto 1rem auto;
//     `;
    
//     document.body.prepend(loadingScreen);
    
//     // Remove loading screen when everything is loaded
//     window.addEventListener('load', function() {
//         setTimeout(() => {
//             loadingScreen.style.opacity = '0';
//             setTimeout(() => {
//                 if (loadingScreen.parentNode) {
//                     loadingScreen.parentNode.removeChild(loadingScreen);
//                 }
//             }, 500);
//         }, 1000);
//     });
// }

// // Initialize loading screen
// initLoadingScreen();

// // Add CSS animations for loading screen
// const loadingStyles = document.createElement('style');
// loadingStyles.textContent = `
//     @keyframes pulse {
//         0%, 100% { transform: scale(1); }
//         50% { transform: scale(1.05); }
//     }
// `;
// document.head.appendChild(loadingStyles);

// PDF Toggle Functionality
function togglePDF(pdfId) {
    const pdfContainer = document.getElementById(pdfId);
    const toggleButton = pdfContainer.parentElement.querySelector('.pdf-toggle i');
    
    if (pdfContainer.classList.contains('expanded')) {
        pdfContainer.classList.remove('expanded');
        toggleButton.className = 'fas fa-expand';
    } else {
        // Close all other PDF containers first
        const allPDFs = document.querySelectorAll('.pdf-container.expanded');
        allPDFs.forEach(pdf => {
            if (pdf.id !== pdfId) {
                pdf.classList.remove('expanded');
                const otherToggle = pdf.parentElement.querySelector('.pdf-toggle i');
                otherToggle.className = 'fas fa-expand';
            }
        });
        
        pdfContainer.classList.add('expanded');
        toggleButton.className = 'fas fa-compress';
    }
}

// A* Pathfinding Maze
function initPathfindingMaze() {
    const canvas = document.getElementById('pathfindingMaze');
    if (!canvas) return;
    
    // Disable maze on mobile devices to prevent scrolling issues
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        canvas.style.display = 'none';
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Load agent image
    const agentImage = new Image();
    agentImage.src = 'images/agent.png'; // Change this to your image path
    let imageLoaded = false;
    agentImage.onload = function() {
        imageLoaded = true;
        console.log('Agent image loaded successfully');
    };
    agentImage.onerror = function() {
        console.error('Failed to load agent image');
        imageLoaded = false;
    };
    
    // Maze parameters
    const CELL_SIZE = 25;
    let GRID_WIDTH, GRID_HEIGHT;
    let maze = [];
    let path = [];
    let remainingPath = []; // Path segments that haven't been traversed yet
    let agent = { x: 0, y: 0, targetIndex: 0 };
    let trail = [];
    let currentEndPosition = { x: 0, y: 0 }; // Current target position
    const MAX_TRAIL_LENGTH = 15;
    
    // Generate random end position on far right side
    function generateRandomEndPosition() {
        const minY = 3; // 3 from top
        const maxY = GRID_HEIGHT - 4; // 3 from bottom (GRID_HEIGHT - 1 - 3)
        const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        return { x: GRID_WIDTH - 1, y: randomY };
    }
    
    // Initialize canvas and maze
    function initMaze() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        GRID_WIDTH = Math.floor(canvas.width / CELL_SIZE);
        GRID_HEIGHT = Math.floor(canvas.height / CELL_SIZE);
        
        // Initialize empty maze
        maze = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
        
        // Generate random end position
        currentEndPosition = generateRandomEndPosition();
        
        // Add some random obstacles (but not too many)
        for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT * 0.15; i++) {
            const x = Math.floor(Math.random() * GRID_WIDTH);
            const y = Math.floor(Math.random() * GRID_HEIGHT);
            // Don't block start (bottom-left) or end (random far-right)
            if ((x === 0 && y === GRID_HEIGHT - 1) || 
                (x === currentEndPosition.x && y === currentEndPosition.y)) {
                continue;
            }
            maze[y][x] = 1;
        }
        
        // Reset agent to bottom-left corner
        agent = { x: 0, y: GRID_HEIGHT - 1, targetIndex: 0 };
        trail = [];
        
        // Find initial path
        findPath();
    }
    
    // A* Pathfinding Algorithm
    function findPath(fromCurrentPosition = false) {
        let start;
        if (fromCurrentPosition && path.length > 0) {
            // Start from agent's current target or closest grid position
            const currentGridX = Math.round(agent.x);
            const currentGridY = Math.round(agent.y);
            start = { x: currentGridX, y: currentGridY };
        } else {
            start = { x: 0, y: GRID_HEIGHT - 1 }; // Bottom-left corner
        }
        
        const end = currentEndPosition; // Use current random end position
        
        const openSet = [start];
        const closedSet = [];
        const cameFrom = new Map();
        
        const gScore = new Map();
        const fScore = new Map();
        
        gScore.set(`${start.x},${start.y}`, 0);
        fScore.set(`${start.x},${start.y}`, heuristic(start, end));
        
        while (openSet.length > 0) {
            // Get node with lowest fScore
            let current = openSet.reduce((min, node) => {
                const minF = fScore.get(`${min.x},${min.y}`) || Infinity;
                const nodeF = fScore.get(`${node.x},${node.y}`) || Infinity;
                return nodeF < minF ? node : min;
            });
            
            if (current.x === end.x && current.y === end.y) {
                // Reconstruct path
                const newPath = [];
                let temp = current;
                while (temp) {
                    newPath.unshift(temp);
                    temp = cameFrom.get(`${temp.x},${temp.y}`);
                }
                
                if (fromCurrentPosition) {
                    // Update agent position and target index for new path
                    path = newPath;
                    remainingPath = [...newPath]; // Copy of path for rendering
                    agent.targetIndex = 0;
                    // Adjust agent position to start of new path if needed
                    if (newPath.length > 0) {
                        const startNode = newPath[0];
                        agent.x = startNode.x;
                        agent.y = startNode.y;
                    }
                } else {
                    // Initial pathfinding
                    path = newPath;
                    remainingPath = [...newPath]; // Copy of path for rendering
                    agent.targetIndex = 0;
                }
                return;
            }
            
            // Move current from open to closed
            openSet.splice(openSet.indexOf(current), 1);
            closedSet.push(current);
            
            // Check neighbors
            const neighbors = getNeighbors(current);
            for (let neighbor of neighbors) {
                if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    continue;
                }
                
                const tentativeGScore = (gScore.get(`${current.x},${current.y}`) || 0) + 1;
                
                if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore.get(`${neighbor.x},${neighbor.y}`) || Infinity)) {
                    continue;
                }
                
                cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
                gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
                fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + heuristic(neighbor, end));
            }
        }
        
        // No path found - if we were pathfinding from current position and failed,
        // try from the start position as fallback
        if (fromCurrentPosition) {
            console.log('No path from current position, trying from start');
            findPath(false);
        } else {
            path = [];
        }
    }
    
    function heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    function getNeighbors(node) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 1, y: 0 },  // right
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }  // left
        ];
        
        for (let dir of directions) {
            const newX = node.x + dir.x;
            const newY = node.y + dir.y;
            
            if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
                if (maze[newY][newX] === 0) { // Not an obstacle
                    neighbors.push({ x: newX, y: newY });
                }
            }
        }
        
        return neighbors;
    }
    
    // Update agent position
    function updateAgent() {
        if (path.length === 0 || agent.targetIndex >= path.length) {
            // Agent has reached the end, reset and start new path
            trail = [];
            currentEndPosition = generateRandomEndPosition();
            agent.x = 0;
            agent.y = GRID_HEIGHT - 1;
            agent.targetIndex = 0;
            findPath(false);
            return;
        }
        
        const target = path[agent.targetIndex];
        const dx = target.x - agent.x;
        const dy = target.y - agent.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.1) {
            // Remove the passed segment from remaining path
            if (remainingPath.length > 0) {
                remainingPath.shift();
            }
            
            // Reached target, move to next
            agent.targetIndex++;
            if (agent.targetIndex >= path.length) {
                // Reached end, will reset on next update
                return;
            }
        } else {
            // Move towards target
            const speed = 0.10;
            agent.x += dx * speed;
            agent.y += dy * speed;
            
            // Add to trail with enhanced glow
            trail.push({ x: agent.x, y: agent.y, alpha: 1.0, glow: 1.0 });
            if (trail.length > MAX_TRAIL_LENGTH) {
                trail.shift();
            }
            
            // Fade trail
            trail.forEach((point, index) => {
                const fadeRatio = (index + 1) / trail.length;
                point.alpha = fadeRatio * 0.8;
                point.glow = fadeRatio * 0.6;
            });
        }
    }
    
    // Draw maze
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid (subtle)
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= GRID_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(canvas.width, y * CELL_SIZE);
            ctx.stroke();
        }
        
        // Draw obstacles
        ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (maze[y][x] === 1) {
                    ctx.fillRect(x * CELL_SIZE + 2, y * CELL_SIZE + 2, 
                               CELL_SIZE - 4, CELL_SIZE - 4);
                }
            }
        }
        
        // Draw remaining path (only untraversed segments)
        if (remainingPath.length > 1) {
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(remainingPath[0].x * CELL_SIZE + CELL_SIZE/2, remainingPath[0].y * CELL_SIZE + CELL_SIZE/2);
            for (let i = 1; i < remainingPath.length; i++) {
                ctx.lineTo(remainingPath[i].x * CELL_SIZE + CELL_SIZE/2, remainingPath[i].y * CELL_SIZE + CELL_SIZE/2);
            }
            ctx.stroke();
        }
        
        // Draw start (bottom-left) and end (random far-right)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.fillRect(2, (GRID_HEIGHT - 1) * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.fillRect(currentEndPosition.x * CELL_SIZE + 2, currentEndPosition.y * CELL_SIZE + 2, 
                    CELL_SIZE - 4, CELL_SIZE - 4);
        
        // Draw shiny trail
        trail.forEach((point, index) => {
            const x = point.x * CELL_SIZE + CELL_SIZE/2;
            const y = point.y * CELL_SIZE + CELL_SIZE/2;
            
            // Outer glow
            ctx.fillStyle = `rgba(37, 99, 235, ${point.glow * 0.2})`; // Blue
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner bright core
            ctx.fillStyle = `rgba(59, 130, 246, ${point.alpha * 0.7})`; // Lighter blue
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Sparkle effect for recent trail points
            if (index > trail.length - 5) {
                ctx.fillStyle = `rgba(255, 255, 255, ${point.alpha * 0.8})`;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Draw agent
        const agentScreenX = agent.x * CELL_SIZE + CELL_SIZE/2;
        const agentScreenY = agent.y * CELL_SIZE + CELL_SIZE/2;
        
        // Draw agent as circular clipped image
        if (imageLoaded && agentImage.complete) {
            const imageSize = 25; // Size of the circular image
            ctx.save();
            
            // Create circular clipping path for dot shape
            ctx.beginPath();
            ctx.arc(agentScreenX, agentScreenY, imageSize / 2, 0, Math.PI * 2);
            ctx.clip();
            
            // Draw image with reduced opacity
            ctx.globalAlpha = 1.1; // Less opaque (50% transparency)
            ctx.drawImage(agentImage, 
                agentScreenX - imageSize / 2, 
                agentScreenY - imageSize / 2, 
                imageSize, 
                imageSize);
            ctx.restore();
        } else {
            // Fallback: Agent body as blue circle
            // ctx.fillStyle = 'rgba(37, 99, 235, 0.9)'; // Blue
            // ctx.beginPath();
            // ctx.arc(agentScreenX, agentScreenY, 8, 0, Math.PI * 2);
            // ctx.fill();
            
            // // Agent glow for fallback
            // ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            // ctx.lineWidth = 2;
            // ctx.stroke();
        }
    }
    
    // Handle clicks to add/remove obstacles (desktop only)
    function handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const gridX = Math.floor(x / CELL_SIZE);
        const gridY = Math.floor(y / CELL_SIZE);
        
        if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
            // Don't allow obstacles on start (bottom-left) or current end position
            if ((gridX === 0 && gridY === GRID_HEIGHT - 1) || 
                (gridX === currentEndPosition.x && gridY === currentEndPosition.y)) {
                return;
            }
            
            // Toggle obstacle
            maze[gridY][gridX] = maze[gridY][gridX] === 0 ? 1 : 0;
            
            // Recalculate path from current position instead of restarting
            findPath(true);
        }
    }
    
    // Animation loop
    function animate() {
        updateAgent();
        draw();
        animationId = requestAnimationFrame(animate);
    }
    
    // Handle window resize
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            canvas.style.display = 'none';
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else {
            canvas.style.display = 'block';
            initMaze();
            if (!animationId) {
                animate();
            }
        }
    }
    
    // Event listeners (desktop only)
    canvas.addEventListener('click', handleClick);
    
    // Prevent touch events on canvas to allow scrolling
    canvas.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, { passive: true });
    
    window.addEventListener('resize', handleResize);
    
    // Initialize and start
    initMaze();
    animate();
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
        window.removeEventListener('resize', handleResize);
    });
}

// Toggle project description expansion
function toggleDescription(button) {
    const projectDescription = button.closest('.project-description');
    const isExpanded = projectDescription.classList.contains('expanded');
    
    if (isExpanded) {
        projectDescription.classList.remove('expanded');
        button.textContent = 'Read More';
    } else {
        projectDescription.classList.add('expanded');
        button.textContent = 'Read Less';
    }
}