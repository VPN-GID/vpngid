// VPN GID Main JavaScript - Modern 2025 Version
// Prevent multiple class declarations
if (typeof window.VPNGid !== 'undefined') {
    console.warn('VPNGid class already exists. Skipping redefinition.');
} else {
class VPNGid {
    constructor() {
        this.currentLang = 'ru';
        this.currentTheme = 'light';
        this.intersectionObserver = null;
        this.performanceMetrics = {
            startTime: performance.now(),
            loadTime: 0,
            interactionCount: 0
        };
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.detectSystemPreferences();
        this.loadUserPreferences();
        this.initEventListeners();
        this.initIntersectionObserver();
        this.initCountdown();
        this.updateContent();
        this.initPerformanceMonitoring();
        this.initAccessibilityFeatures();
        this.preloadCriticalResources();
        
        // Mark initialization complete
        this.performanceMetrics.loadTime = performance.now() - this.performanceMetrics.startTime;
    }

    // Detect system preferences and current language from URL
    detectSystemPreferences() {
        // Detect current language from URL first - URL has priority
        const currentPath = window.location.pathname;
        const detectedLang = (currentPath.startsWith('/en/') || currentPath === '/en') ? 'en' : 'ru';
        
        // Only update localStorage if language changed
        const savedLang = localStorage.getItem('vpngid-language');
        if (savedLang !== detectedLang) {
            this.currentLang = detectedLang;
            localStorage.setItem('vpngid-language', detectedLang);
        } else {
            this.currentLang = detectedLang;
        }

        // Detect system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        }
    }

    // Load user preferences from localStorage
    loadUserPreferences() {
        // For language: URL takes precedence, so we don't override from localStorage
        // The detectSystemPreferences() already set the correct language based on URL
        
        const savedTheme = localStorage.getItem('vpngid-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }

        this.applyTheme();
        this.updateLanguageButtons();
    }

    // Initialize modern event listeners with performance optimization
    initEventListeners() {
        // Theme toggle with accessibility
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
                this.performanceMetrics.interactionCount++;
            });
            
            // Keyboard support
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        // Language toggle with delegation
        const langToggle = document.querySelector('.lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', (e) => {
                if (e.target.classList.contains('lang-btn')) {
                    const lang = e.target.dataset.lang;
                    this.setLanguage(lang);
                    this.performanceMetrics.interactionCount++;
                }
            });
        }

        // Mobile menu toggle with ARIA support
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
                this.performanceMetrics.interactionCount++;
            });
        }

        // FAQ toggle functionality with event delegation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                this.toggleFAQ(e.target.closest('.faq-question'));
            }
        });

        // System preferences listeners
        if (window.matchMedia) {
            // Theme preference
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('vpngid-theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });

            // Motion preference
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            motionQuery.addEventListener('change', (e) => {
                this.prefersReducedMotion = e.matches;
                this.updateAnimations();
            });
        }

        // Enhanced smooth scroll with intersection observer
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                    
                    // Update focus for accessibility
                    target.focus({ preventScroll: true });
                }
            }
        });

        // Performance optimization: Passive scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Error boundary for unhandled errors
        window.addEventListener('error', (e) => {
            console.error('Unhandled error:', e.error);
            this.trackError(e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.trackError(e.reason);
        });
    }

    // Initialize Intersection Observer for animations
    initIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    if (entry.target.hasAttribute('data-animate-once')) {
                        this.intersectionObserver.unobserve(entry.target);
                    }
                }
            });
        }, options);

        // Observe elements that should animate
        const animateElements = document.querySelectorAll(
            '.vpn-card, .feature-card, .article-card, .deal-card, .section-title'
        );
        animateElements.forEach(el => {
            el.setAttribute('data-animate-once', 'true');
            this.intersectionObserver.observe(el);
        });
    }

    // Performance monitoring (disabled for production)
    initPerformanceMonitoring() {
        // Performance monitoring disabled to reduce overhead
        // Enable in development by uncommenting the code below
        /* 
        if ('PerformanceObserver' in window && window.DEBUG) {
            // Monitor performance only in debug mode
        }
        */
    }

    // Accessibility features initialization
    initAccessibilityFeatures() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Перейти к основному содержанию';
        skipLink.className = 'skip-link sr-only';
        skipLink.addEventListener('focus', () => skipLink.classList.remove('sr-only'));
        skipLink.addEventListener('blur', () => skipLink.classList.add('sr-only'));
        document.body.insertBefore(skipLink, document.body.firstChild);


        // Announce theme changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.id = 'theme-announcer';
        document.body.appendChild(announcer);
    }

    // Preload critical resources (mobile optimized)
    preloadCriticalResources() {
        // Check if resources already preloaded in HTML to avoid duplication
        const existingPreloads = Array.from(document.querySelectorAll('link[rel="preload"]'))
            .map(link => link.href);
        
        const additionalImages = [
            '/img/features/shield.svg',
            '/img/features/privacy.svg',
            '/img/features/globe.svg',
            '/img/features/speed.svg'
        ];

        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Only preload images not already preloaded
        additionalImages.forEach(src => {
            const fullUrl = new URL(src, window.location.origin).href;
            if (!existingPreloads.includes(fullUrl)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                fragment.appendChild(link);
            }
        });

        // Smart prefetch: only on good connections and main page
        if ((window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '/index') && 
            this.shouldPrefetch()) {
            const nextPageLink = document.createElement('link');
            nextPageLink.rel = 'prefetch';
            nextPageLink.href = '/best-vpn';
            fragment.appendChild(nextPageLink);
        }
        
        if (fragment.children.length > 0) {
            document.head.appendChild(fragment);
        }
    }

    // Check if we should prefetch based on connection quality
    shouldPrefetch() {
        // Don't prefetch on slow connections to save mobile data
        if ('connection' in navigator) {
            const connection = navigator.connection;
            // Skip prefetch on 2G or slow connections
            if (connection.effectiveType === '2g' || 
                connection.effectiveType === 'slow-2g' ||
                connection.saveData === true) {
                return false;
            }
        }
        
        // Also check if device has limited resources (simplified heuristic)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
            // Lower core count devices likely have limited memory/processing
            return Math.random() < 0.5; // 50% chance to prefetch
        }
        
        return true;
    }

    // Handle scroll events with throttling for mobile performance
    handleScroll() {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (header) {
            if (scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    }

    // Throttle function for better mobile performance
    throttle(func, limit) {
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

    // Update animations based on motion preferences
    updateAnimations() {
        document.documentElement.style.setProperty(
            '--animation-duration',
            this.prefersReducedMotion ? '0ms' : '250ms'
        );
    }

    // Error tracking
    trackError(error) {
        // In a real application, you would send this to your analytics service
        console.error('Application error tracked:', error);
    }


    // Toggle theme with accessibility enhancements
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('vpngid-theme', this.currentTheme);
        
        // Update aria-pressed state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', this.currentTheme === 'dark');
        }
        
        // Announce change to screen readers
        const announcer = document.getElementById('theme-announcer');
        if (announcer) {
            const themeNames = {
                light: { ru: 'Светлая тема', en: 'Light theme' },
                dark: { ru: 'Тёмная тема', en: 'Dark theme' }
            };
            const activatedText = {
                ru: 'активирована',
                en: 'activated'
            };
            const message = `${themeNames[this.currentTheme][this.currentLang]} ${activatedText[this.currentLang]}`;
            announcer.textContent = message;
            
            // Clear message after announcement
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
        
        // Update meta theme-color for mobile browsers
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = this.currentTheme === 'dark' ? '#1F2937' : '#3B82F6';
        }
    }

    // Apply theme
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // The CSS will handle the icon visibility based on data-theme attribute
        // No need to manually toggle classes as the CSS already does this:
        // [data-theme="light"] .sun-icon, [data-theme="dark"] .moon-icon { display: block; }
        // [data-theme="light"] .moon-icon, [data-theme="dark"] .sun-icon { display: none; }
    }

    // Set language and redirect to appropriate URL
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('vpngid-language', lang);
        
        // Get current path without language prefix
        let currentPath = window.location.pathname;
        let basePath = currentPath;
        
        // Remove /en prefix if it exists
        if (currentPath.startsWith('/en/')) {
            basePath = currentPath.substring(3);
        } else if (currentPath.startsWith('/en')) {
            basePath = currentPath.substring(3);
        }
        
        // Handle root path
        if (basePath === '' || basePath === '/') {
            basePath = '/';
        }
        
        // Construct new URL
        let newPath;
        if (lang === 'en') {
            newPath = '/en' + basePath;
            // Handle root case for English
            if (basePath === '/') {
                newPath = '/en/';
            }
        } else {
            newPath = basePath;
            // Ensure root path is just '/'
            if (basePath === '/') {
                newPath = '/';
            }
        }
        
        // Only redirect if URL needs to change
        if (newPath !== currentPath) {
            window.location.href = newPath;
        } else {
            // If we're already on the correct URL, just update UI
            this.updateLanguageButtons();
            this.updateContent();
        }
    }

    // Update language buttons
    updateLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Update content based on language
    updateContent() {
        // Update text content - exclude buttons that should not have text content changed
        const elementsWithLangData = document.querySelectorAll('[data-ru][data-en]:not(.theme-toggle):not(button[id])');
        elementsWithLangData.forEach(element => {
            const text = element.dataset[this.currentLang];
            if (text) {
                element.textContent = text;
            }
        });

        // Update button attributes separately (like aria-label) without changing textContent
        const buttonsWithLangData = document.querySelectorAll('button[data-ru][data-en]');
        buttonsWithLangData.forEach(button => {
            const text = button.dataset[this.currentLang];
            if (text) {
                button.setAttribute('aria-label', text);
                // Don't change textContent for buttons that contain icons
            }
        });

        // Update prices
        this.updatePrices();

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;

        // Update page title and meta description if on main page
        this.updatePageMeta();
    }

    // Update prices based on language/currency (optimized)
    updatePrices() {
        // Cache all price-related elements in one query
        const allPriceElements = document.querySelectorAll(`
            .price-amount[data-rub][data-usd],
            .price-currency,
            .price-period[data-ru][data-en],
            .deal-old-price[data-ru][data-en],
            .deal-new-price span[data-ru][data-en],
            .price-cell span[data-ru][data-en],
            .deal-period[data-ru][data-en]
        `);
        
        allPriceElements.forEach(element => {
            // Handle price amounts
            if (element.classList.contains('price-amount')) {
                element.textContent = this.currentLang === 'ru' ? element.dataset.rub : element.dataset.usd;
            }
            // Handle currency symbols
            else if (element.classList.contains('price-currency')) {
                element.textContent = this.currentLang === 'ru' ? (element.dataset.ru || '₽') : (element.dataset.en || '$');
            }
            // Handle elements with data-ru/data-en attributes
            else if (element.dataset.ru && element.dataset.en) {
                element.textContent = element.dataset[this.currentLang];
            }
        });
    }

    // Update page meta information
    updatePageMeta() {
        const titles = {
            ru: 'VPN GID - Ваш гид в мире свободного и безопасного интернета',
            en: 'VPN GID - Your Guide to a Free and Secure Internet'
        };

        const descriptions = {
            ru: 'Независимые обзоры лучших VPN-сервисов 2025 года. Сравнение цен, функций и безопасности. Эксклюзивные скидки до 85%.',
            en: 'Independent reviews of the best VPN services of 2025. Compare prices, features and security. Exclusive discounts up to 85%.'
        };

        const titleElement = document.querySelector('title');
        const descriptionElement = document.querySelector('meta[name="description"]');

        if (titleElement && (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '/index')) {
            titleElement.textContent = titles[this.currentLang];
        }

        if (descriptionElement && (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '/index')) {
            descriptionElement.setAttribute('content', descriptions[this.currentLang]);
        }
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        if (navMenu && mobileToggle) {
            navMenu.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active');
        }
    }

    // Toggle FAQ item
    toggleFAQ(questionButton) {
        const faqItem = questionButton.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current FAQ item
        faqItem.classList.toggle('active', !isActive);
    }

    // Initialize countdown timer
    initCountdown() {
        // Check for coupon countdown on coupon pages
        if (window.location.pathname.includes('coupons')) {
            this.initCouponCountdown();
        } else {
            // Regular countdown for other pages
            const countdownElement = document.getElementById('countdown');
            if (!countdownElement) return;

            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (!hoursElement || !minutesElement || !secondsElement) return;

            // Set countdown to end of current day
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = endOfDay.getTime() - now;

                if (distance < 0) {
                    // Reset to end of next day
                    endOfDay.setDate(endOfDay.getDate() + 1);
                    endOfDay.setHours(23, 59, 59, 999);
                    return;
                }

                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                hoursElement.textContent = hours.toString().padStart(2, '0');
                minutesElement.textContent = minutes.toString().padStart(2, '0');
                secondsElement.textContent = seconds.toString().padStart(2, '0');
            };

            // Update countdown immediately and then every second
            updateCountdown();
            this.countdownInterval = setInterval(updateCountdown, 1000);
        }
    }

    // Initialize special countdown for coupon pages
    initCouponCountdown() {
        // Clear existing interval if it exists
        if (this.couponCountdownInterval) {
            clearInterval(this.couponCountdownInterval);
            this.couponCountdownInterval = null;
        }
        
        // Find countdown elements
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (hoursEl && minutesEl && secondsEl) {
            // Initialize time only if not already set
            if (!this.couponTimeLeft) {
                this.couponTimeLeft = 23 * 3600 + 59 * 60 + 45; // Start from 23:59:45
            }
            
            const updateCountdown = () => {
                // Decrease time first
                if (this.couponTimeLeft > 0) {
                    this.couponTimeLeft--;
                } else {
                    this.couponTimeLeft = 23 * 3600 + 59 * 60 + 59; // Reset to 23:59:59
                }
                
                // Calculate display values
                const hours = Math.floor(this.couponTimeLeft / 3600);
                const minutes = Math.floor((this.couponTimeLeft % 3600) / 60);
                const seconds = this.couponTimeLeft % 60;
                
                const formattedHours = hours.toString().padStart(2, '0');
                const formattedMinutes = minutes.toString().padStart(2, '0');
                const formattedSeconds = seconds.toString().padStart(2, '0');
                
                // Update countdown elements
                hoursEl.textContent = formattedHours;
                minutesEl.textContent = formattedMinutes;
                secondsEl.textContent = formattedSeconds;
            };
            
            updateCountdown();
            this.couponCountdownInterval = setInterval(updateCountdown, 1000);
        }
    }


}

// Mobile menu styles are now handled in main.css

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Prevent multiple initializations
    if (window.vpnGidApp) {
        return;
    }
    
    const app = new VPNGid();
    window.vpnGidApp = app;
    
});

// Handle page visibility change - removed automatic countdown reinitialization
// to prevent multiple timers running simultaneously
document.addEventListener('visibilitychange', () => {
    // Timer will continue running in background
    // No reinitialization needed
});

// Export for global access only if not already defined
if (typeof window.VPNGid === 'undefined') {
    window.VPNGid = VPNGid;
}
}
