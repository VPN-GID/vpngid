if (typeof window.VPNGid !== 'undefined') {
console.warn('VPNGid class already exists. Skipping redefinition.');
} else {
class VPNGid {
constructor() {
this.currentLang = 'ru';
this.currentTheme = 'dark';
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
this.performanceMetrics.loadTime = performance.now() - this.performanceMetrics.startTime;
}
detectSystemPreferences() {
const currentPath = window.location.pathname;
const detectedLang = (currentPath.startsWith('/en/') || currentPath === '/en') ? 'en' : 'ru';
const savedLang = localStorage.getItem('vpngid-language');
if (savedLang !== detectedLang) {
this.currentLang = detectedLang;
localStorage.setItem('vpngid-language', detectedLang);
} else {
this.currentLang = detectedLang;
}
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
this.currentTheme = 'dark';
}
}
loadUserPreferences() {
const savedTheme = localStorage.getItem('vpngid-theme');
if (savedTheme) {
this.currentTheme = savedTheme;
}
this.applyTheme();
this.updateLanguageButtons();
}
initEventListeners() {
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
themeToggle.addEventListener('click', () => {
this.toggleTheme();
this.performanceMetrics.interactionCount++;
});
themeToggle.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.toggleTheme();
}
});
}
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
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
if (mobileMenuToggle) {
mobileMenuToggle.addEventListener('click', () => {
this.toggleMobileMenu();
this.performanceMetrics.interactionCount++;
});
}
document.addEventListener('click', (e) => {
if (e.target.closest('.faq-question')) {
this.toggleFAQ(e.target.closest('.faq-question'));
}
});
if (window.matchMedia) {
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
if (!localStorage.getItem('vpngid-theme')) {
this.currentTheme = e.matches ? 'dark' : 'light';
this.applyTheme();
}
});
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
motionQuery.addEventListener('change', (e) => {
this.prefersReducedMotion = e.matches;
this.updateAnimations();
});
}
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
target.focus({ preventScroll: true });
}
}
});
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
window.addEventListener('error', (e) => {
console.error('Unhandled error:', e.error);
this.trackError(e.error);
});
window.addEventListener('unhandledrejection', (e) => {
console.error('Unhandled promise rejection:', e.reason);
this.trackError(e.reason);
});
}
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
const animateElements = document.querySelectorAll(
'.vpn-card, .feature-card, .article-card, .deal-card, .section-title'
);
animateElements.forEach(el => {
el.setAttribute('data-animate-once', 'true');
this.intersectionObserver.observe(el);
});
}
initPerformanceMonitoring() {
}
initAccessibilityFeatures() {
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.textContent = 'Перейти к основному содержанию';
skipLink.className = 'skip-link sr-only';
skipLink.addEventListener('focus', () => skipLink.classList.remove('sr-only'));
skipLink.addEventListener('blur', () => skipLink.classList.add('sr-only'));
document.body.insertBefore(skipLink, document.body.firstChild);
const announcer = document.createElement('div');
announcer.setAttribute('aria-live', 'polite');
announcer.setAttribute('aria-atomic', 'true');
announcer.className = 'sr-only';
announcer.id = 'theme-announcer';
document.body.appendChild(announcer);
}
preloadCriticalResources() {
const existingPreloads = Array.from(document.querySelectorAll('link[rel="preload"]'))
.map(link => link.href);
const additionalImages = [
'/img/features/shield.svg',
'/img/features/privacy.svg',
'/img/features/globe.svg',
'/img/features/speed.svg'
];
const fragment = document.createDocumentFragment();
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
shouldPrefetch() {
if ('connection' in navigator) {
const connection = navigator.connection;
if (connection.effectiveType === '2g' ||
connection.effectiveType === 'slow-2g' ||
connection.saveData === true) {
return false;
}
}
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
return Math.random() < 0.5;
}
return true;
}
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
updateAnimations() {
document.documentElement.style.setProperty(
'--animation-duration',
this.prefersReducedMotion ? '0ms' : '250ms'
);
}
trackError(error) {
console.error('Application error tracked:', error);
}
toggleTheme() {
this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
this.applyTheme();
localStorage.setItem('vpngid-theme', this.currentTheme);
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
themeToggle.setAttribute('aria-pressed', this.currentTheme === 'dark');
}
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
setTimeout(() => {
announcer.textContent = '';
}, 1000);
}
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
if (themeColorMeta) {
themeColorMeta.content = this.currentTheme === 'dark' ? '#1F2937' : '#3B82F6';
}
}
applyTheme() {
document.documentElement.setAttribute('data-theme', this.currentTheme);
}
setLanguage(lang) {
this.currentLang = lang;
localStorage.setItem('vpngid-language', lang);
let currentPath = window.location.pathname;
let basePath = currentPath;
if (currentPath.startsWith('/en/')) {
basePath = currentPath.substring(3);
} else if (currentPath.startsWith('/en')) {
basePath = currentPath.substring(3);
}
if (basePath === '' || basePath === '/') {
basePath = '/';
}
let newPath;
if (lang === 'en') {
newPath = '/en' + basePath;
if (basePath === '/') {
newPath = '/en/';
}
} else {
newPath = basePath;
if (basePath === '/') {
newPath = '/';
}
}
if (newPath !== currentPath) {
window.location.href = newPath;
} else {
this.updateLanguageButtons();
this.updateContent();
}
}
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
updateContent() {
const elementsWithLangData = document.querySelectorAll('[data-ru][data-en]:not(.theme-toggle):not(button[id])');
elementsWithLangData.forEach(element => {
const text = element.dataset[this.currentLang];
if (text) {
element.textContent = text;
}
});
const buttonsWithLangData = document.querySelectorAll('button[data-ru][data-en]');
buttonsWithLangData.forEach(button => {
const text = button.dataset[this.currentLang];
if (text) {
button.setAttribute('aria-label', text);
}
});
this.updatePrices();
document.documentElement.lang = this.currentLang;
this.updatePageMeta();
}
updatePrices() {
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
if (element.classList.contains('price-amount')) {
element.textContent = this.currentLang === 'ru' ? element.dataset.rub : element.dataset.usd;
}
else if (element.classList.contains('price-currency')) {
element.textContent = this.currentLang === 'ru' ? (element.dataset.ru || '₽') : (element.dataset.en || '$');
}
else if (element.dataset.ru && element.dataset.en) {
element.textContent = element.dataset[this.currentLang];
}
});
}
updatePageMeta() {
const currentPath = window.location.pathname;
const pageMeta = {
'index': {
titles: {
ru: 'VPN GID — Тестирую VPN с 2019 года | Топ сервисов 2025',
en: 'VPN GID — Real VPN Tests Since 2019 | Best Services 2025'
},
descriptions: {
ru: 'Протестировал 50+ VPN за 5 лет. Показываю лучшие сервисы 2025: скорость, безопасность, реальные цены. Скидки до 85% на проверенные VPN.',
en: 'I\'ve personally tested 50+ VPNs over 5 years. Real speed tests, security audits, streaming performance. Get up to 85% off verified VPN services.'
}
},
'best-vpn': {
titles: {
ru: 'Какой VPN реально работает в 2025? Тестирую 5 лет | VPN GID',
en: 'Which VPN Actually Works in 2025? 5 Years of Testing | VPN GID'
},
descriptions: {
ru: 'Протестировал 50+ VPN за 5 лет. Реальные замеры скорости, проверка утечек, тесты Netflix и торрентов. AdGuard, HideMyName, CyberGhost — мой честный опыт.',
en: 'Tested 50+ VPNs over 5 years. Real Speedtest benchmarks, DNS leak checks, Netflix 4K & torrent tests. AdGuard, HideMyName, CyberGhost — my honest experience.'
}
},
'coupons': {
titles: {
ru: 'Купоны VPN со скидкой до 85% — Проверил все в 2025 | VPN GID',
en: 'VPN Deals Up to 85% Off — Verified October 2025 | VPN GID'
},
descriptions: {
ru: 'Собрал работающие промокоды VPN за октябрь 2025. AdGuard 189₽ вместо 756₽, CyberGhost $2.11, HideMyName от 299₽. Тестирую каждую скидку лично.',
en: 'I negotiate VPN deals directly with providers. October 2025: AdGuard $2.99 (was $11.99), CyberGhost $2.11, HideMyName $4.99. All codes tested personally.'
}
},
'articles': {
titles: {
ru: 'Гайды по VPN от практика с 2019 года | VPN GID',
en: 'VPN Guides from Hands-On Expert | VPN GID'
},
descriptions: {
ru: 'Практические гайды по VPN: как работает шифрование, выбор VPN за 5 минут, почему бесплатные опасны. Делюсь опытом после 50+ тестов.',
en: '50+ VPNs tested hands-on. Learn how VPNs work, pick one in 3 steps, avoid free VPN traps. Real experience, zero marketing BS.'
}
},
'what-is-vpn': {
titles: {
ru: 'Что такое VPN и как он работает? Объясняю простым языком | VPN GID',
en: 'What is VPN and How Does It Work? Simple Explanation | VPN GID'
},
descriptions: {
ru: 'Простым языком объясняю, что такое VPN: как работает шифрование, для чего нужен VPN в 2025, реальные примеры использования. Понятно даже новичкам.',
en: 'VPN explained in simple terms: how encryption works, why you need VPN in 2025, real-world examples. No tech jargon, easy for beginners.'
}
},
'how-to-choose-vpn': {
titles: {
ru: 'Как выбрать VPN за 5 минут? Гайд от практика | VPN GID',
en: 'How to Choose VPN in 3 Steps? Practical Guide | VPN GID'
},
descriptions: {
ru: 'Выбираю VPN по простой схеме: скорость > безопасность > цена. Протестировал 50+ сервисов — делюсь чек-листом на 5 минут.',
en: 'Choose VPN using my simple formula: speed > security > price. Tested 50+ services — here\'s my 3-step checklist.'
}
},
'are-free-vpn-safe': {
titles: {
ru: 'Безопасны ли бесплатные VPN? Протестировал 20 сервисов | VPN GID',
en: 'Are Free VPNs Safe? I Tested 20 Services | VPN GID'
},
descriptions: {
ru: 'Протестировал 20 бесплатных VPN на утечки и продажу данных. Результат: 18 из 20 небезопасны. Показываю, какие можно использовать.',
en: 'Tested 20 free VPNs for leaks and data selling. Results: 18/20 are unsafe. Here are the only 2 you can trust.'
}
}
};
const titleElement = document.querySelector('title');
const descriptionElement = document.querySelector('meta[name="description"]');
let pageType = null;
if (currentPath === '/' || currentPath === '/index.html' || currentPath === '/index' || currentPath === '/en/' || currentPath === '/en/index.html' || currentPath === '/en/index') {
pageType = 'index';
} else if (currentPath === '/best-vpn' || currentPath === '/best-vpn.html' || currentPath === '/en/best-vpn' || currentPath === '/en/best-vpn.html') {
pageType = 'best-vpn';
} else if (currentPath === '/coupons' || currentPath === '/coupons.html' || currentPath === '/en/coupons' || currentPath === '/en/coupons.html') {
pageType = 'coupons';
} else if (currentPath === '/articles/' || currentPath === '/articles/index.html' || currentPath === '/en/articles/' || currentPath === '/en/articles/index.html') {
pageType = 'articles';
} else if (currentPath.includes('/articles/what-is-vpn') || currentPath.includes('/en/articles/what-is-vpn')) {
pageType = 'what-is-vpn';
} else if (currentPath.includes('/articles/how-to-choose-vpn') || currentPath.includes('/en/articles/how-to-choose-vpn')) {
pageType = 'how-to-choose-vpn';
} else if (currentPath.includes('/articles/are-free-vpn-safe') || currentPath.includes('/en/articles/are-free-vpn-safe')) {
pageType = 'are-free-vpn-safe';
}
if (pageType && pageMeta[pageType]) {
if (titleElement) {
titleElement.textContent = pageMeta[pageType].titles[this.currentLang];
}
if (descriptionElement) {
descriptionElement.setAttribute('content', pageMeta[pageType].descriptions[this.currentLang]);
}
}
}
toggleMobileMenu() {
const navMenu = document.querySelector('.nav-menu');
const mobileToggle = document.getElementById('mobileMenuToggle');
if (navMenu && mobileToggle) {
navMenu.classList.toggle('mobile-open');
mobileToggle.classList.toggle('active');
}
}
toggleFAQ(questionButton) {
const faqItem = questionButton.closest('.faq-item');
const isActive = faqItem.classList.contains('active');
document.querySelectorAll('.faq-item.active').forEach(item => {
if (item !== faqItem) {
item.classList.remove('active');
}
});
faqItem.classList.toggle('active', !isActive);
}
initCountdown() {
if (window.location.pathname.includes('coupons')) {
this.initCouponCountdown();
} else {
const countdownElement = document.getElementById('countdown');
if (!countdownElement) return;
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
if (!hoursElement || !minutesElement || !secondsElement) return;
const now = new Date();
const endOfDay = new Date(now);
endOfDay.setHours(23, 59, 59, 999);
const updateCountdown = () => {
const now = new Date().getTime();
const distance = endOfDay.getTime() - now;
if (distance < 0) {
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
updateCountdown();
this.countdownInterval = setInterval(updateCountdown, 1000);
}
}
initCouponCountdown() {
if (this.couponCountdownInterval) {
clearInterval(this.couponCountdownInterval);
this.couponCountdownInterval = null;
}
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
if (hoursEl && minutesEl && secondsEl) {
if (!this.couponTimeLeft) {
this.couponTimeLeft = 23 * 3600 + 59 * 60 + 45;
}
const updateCountdown = () => {
if (this.couponTimeLeft > 0) {
this.couponTimeLeft--;
} else {
this.couponTimeLeft = 23 * 3600 + 59 * 60 + 59;
}
const hours = Math.floor(this.couponTimeLeft / 3600);
const minutes = Math.floor((this.couponTimeLeft % 3600) / 60);
const seconds = this.couponTimeLeft % 60;
const formattedHours = hours.toString().padStart(2, '0');
const formattedMinutes = minutes.toString().padStart(2, '0');
const formattedSeconds = seconds.toString().padStart(2, '0');
hoursEl.textContent = formattedHours;
minutesEl.textContent = formattedMinutes;
secondsEl.textContent = formattedSeconds;
};
updateCountdown();
this.couponCountdownInterval = setInterval(updateCountdown, 1000);
}
}
}
document.addEventListener('DOMContentLoaded', () => {
if (window.vpnGidApp) {
return;
}
const app = new VPNGid();
window.vpnGidApp = app;
});
document.addEventListener('visibilitychange', () => {
});
if (typeof window.VPNGid === 'undefined') {
window.VPNGid = VPNGid;
}
}