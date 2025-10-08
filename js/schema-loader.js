/**
 * Schema.org Dynamic Loader for VPN GID
 * Автоматически загружает соответствующие Schema.org данные для каждой страницы
 */

class SchemaLoader {
    constructor() {
        this.baseUrl = window.location.origin;
        this.currentPath = window.location.pathname;
        this.isEnglish = this.currentPath.startsWith('/en/');
        this.loadPageSchema();
    }

    // Основной метод загрузки схемы
    async loadPageSchema() {
        try {
            let schemaData;
            
            // Определяем тип страницы и загружаем соответствующую схему
            if (this.isHomePage()) {
                schemaData = await this.loadHomeSchema();
            } else if (this.isArticlePage()) {
                schemaData = await this.loadArticleSchema();
            } else if (this.isReviewPage()) {
                schemaData = await this.loadReviewSchema();
            } else if (this.isCouponsPage()) {
                schemaData = await this.loadCouponsSchema();
            }

            if (schemaData) {
                this.injectSchema(schemaData);
            }
        } catch (error) {
            console.warn('Schema.org loading failed:', error);
        }
    }

    // Проверка типа страниц
    isHomePage() {
        return this.currentPath === '/' || this.currentPath === '/en/' || 
               this.currentPath === '/index.html' || this.currentPath === '/en/index.html' ||
               this.currentPath === '/index' || this.currentPath === '/en/index';
    }

    isArticlePage() {
        return this.currentPath.includes('/articles/');
    }

    isReviewPage() {
        return this.currentPath.includes('/best-vpn.html') || this.currentPath.includes('/best-vpn');
    }

    isCouponsPage() {
        return this.currentPath.includes('/coupons.html') || this.currentPath.includes('/coupons');
    }


    // Загрузка схемы для главной страницы
    async loadHomeSchema() {
        const baseSchema = this.isEnglish ? 
            await this.fetchSchema('/schema/locales/schema-en.json') : 
            await this.fetchSchema('/schema/locales/schema-ru.json');
        
        return baseSchema;
    }

    // Загрузка схемы для статей
    async loadArticleSchema() {
        const template = await this.fetchSchema('/schema/templates/article.json');
        const pageData = this.extractPageData();
        
        return this.populateTemplate(template, {
            'ARTICLE_TITLE': pageData.title,
            'ARTICLE_DESCRIPTION': pageData.description,
            'ARTICLE_IMAGE': pageData.image,
            'ARTICLE_URL': this.baseUrl + this.currentPath,
            'PUBLISH_DATE': pageData.publishDate || '2025-08-24',
            'MODIFIED_DATE': pageData.modifiedDate || '2025-08-24',
            'ARTICLE_SECTION': pageData.section || (this.isEnglish ? 'VPN Technology' : 'VPN Технологии'),
            'WORD_COUNT': pageData.wordCount || '2500',
            'LANGUAGE': this.isEnglish ? 'en-US' : 'ru-RU'
        });
    }

    // Загрузка схемы для обзоров
    async loadReviewSchema() {
        const template = await this.fetchSchema('/schema/templates/review.json');
        const pageData = this.extractPageData();
        
        // Динамически определяем VPN из заголовка страницы или используем AdGuard по умолчанию
        const titleText = pageData.title.toLowerCase();
        let vpnName = 'AdGuard VPN';
        let vpnData = {};

        // Определяем какой VPN обзор на основе заголовка
        if (titleText.includes('hidemyname') || titleText.includes('hide my name')) {
            vpnName = 'HideMyName VPN';
            vpnData = {
                'VPN_WEBSITE': 'https://hidemyname.me/',
                'PRICE': '4.99',
                'RATING_VALUE': '4.6',
                'RATING_COUNT': '120',
                'VPN_DESCRIPTION': this.isEnglish ? 
                    'Reliable VPN service with strong privacy protection' : 
                    'Надежный VPN сервис с усиленной защитой приватности'
            };
        } else if (titleText.includes('cyberghost')) {
            vpnName = 'CyberGhost VPN';
            vpnData = {
                'VPN_WEBSITE': 'https://cyberghostvpn.com/',
                'PRICE': '2.11',
                'RATING_VALUE': '4.7',
                'RATING_COUNT': '200',
                'VPN_DESCRIPTION': this.isEnglish ? 
                    'User-friendly VPN with streaming optimization' : 
                    'Удобный VPN с оптимизацией для стриминга'
            };
        } else if (titleText.includes('protonvpn') || titleText.includes('proton')) {
            vpnName = 'ProtonVPN';
            vpnData = {
                'VPN_WEBSITE': 'https://protonvpn.com/',
                'PRICE': '4.99',
                'RATING_VALUE': '4.5',
                'RATING_COUNT': '180',
                'VPN_DESCRIPTION': this.isEnglish ? 
                    'Secure VPN from Swiss privacy experts' : 
                    'Безопасный VPN от швейцарских экспертов по приватности'
            };
        } else {
            // AdGuard VPN по умолчанию
            vpnData = {
                'VPN_WEBSITE': 'https://adguard-vpn.com',
                'PRICE': '2.99',
                'RATING_VALUE': '4.8',
                'RATING_COUNT': '150',
                'VPN_DESCRIPTION': this.isEnglish ? 
                    'Fast and secure VPN with excellent encryption' : 
                    'Быстрый и безопасный VPN с отличным шифрованием'
            };
        }

        const completeVpnData = {
            'VPN_NAME': vpnName,
            ...vpnData,
            'OPERATING_SYSTEMS': ['Windows', 'macOS', 'iOS', 'Android', 'Linux'],
            'REVIEW_RATING': vpnData.RATING_VALUE,
            'PUBLISH_DATE': '2025-08-24',
            'REVIEW_TEXT': this.isEnglish ? 
                `${vpnName} showed excellent results in our speed and security tests.` :
                `${vpnName} показал отличные результаты в наших тестах скорости и безопасности.`,
            'POSITIVE_1': this.isEnglish ? 'High connection speed' : 'Высокая скорость соединения',
            'POSITIVE_2': this.isEnglish ? 'Reliable AES-256 encryption' : 'Надежное шифрование AES-256',
            'POSITIVE_3': this.isEnglish ? 'User-friendly apps for all platforms' : 'Удобные приложения для всех платформ',
            'NEGATIVE_1': this.isEnglish ? 'Limited server count' : 'Ограниченное количество серверов',
            'NEGATIVE_2': this.isEnglish ? 'No free version' : 'Нет бесплатной версии'
        };
        
        return this.populateTemplate(template, completeVpnData);
    }

    // Загрузка схемы для купонов
    async loadCouponsSchema() {
        const template = await this.fetchSchema('/schema/templates/coupons.json');
        const pageData = this.extractPageData();
        
        return this.populateTemplate(template, {
            'CATALOG_NAME': pageData.title || 'VPN Купоны и Скидки',
            'CATALOG_DESCRIPTION': pageData.description || 'Эксклюзивные промокоды и скидки до 85% на лучшие VPN-сервисы',
            'CATALOG_URL': this.baseUrl + this.currentPath,
            'OFFER_NAME': 'VPN Скидки',
            'OFFER_DESCRIPTION': 'Эксклюзивные скидки на VPN сервисы',
            'OFFER_PRICE': '2.99',
            'VALID_UNTIL': '2025-12-31',
            'DISCOUNT_PERCENT': '75%',
            'VPN_NAME': 'Premium VPN',
            'OFFER_URL': this.baseUrl + this.currentPath
        });
    }


    // Получение данных страницы из meta-тегов
    extractPageData() {
        return {
            title: document.querySelector('title')?.textContent || '',
            description: document.querySelector('meta[name="description"]')?.content || '',
            image: document.querySelector('meta[property="og:image"]')?.content || '',
            publishDate: document.querySelector('meta[property="article:published_time"]')?.content,
            modifiedDate: document.querySelector('meta[property="article:modified_time"]')?.content,
            section: document.querySelector('meta[property="article:section"]')?.content,
            wordCount: this.estimateWordCount()
        };
    }

    // Оценка количества слов на странице
    estimateWordCount() {
        const content = document.querySelector('main, article, .content')?.textContent || '';
        return content.trim().split(/\s+/).length.toString();
    }

    // Загрузка JSON схемы
    async fetchSchema(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch schema: ${url}`);
        }
        return await response.json();
    }

    // Заполнение шаблона переменными
    populateTemplate(template, variables) {
        let jsonString = JSON.stringify(template);
        
        Object.entries(variables).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            jsonString = jsonString.replace(new RegExp(placeholder, 'g'), value);
        });
        
        return JSON.parse(jsonString);
    }

    // Внедрение схемы в страницу
    injectSchema(schemaData) {
        // Удаляем существующие schema.org скрипты (если есть)
        const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
        existingSchemas.forEach(script => {
            if (script.textContent.includes('"@context": "https://schema.org"')) {
                script.remove();
            }
        });

        // Создаем новый script элемент
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaData, null, 2);
        
        // Добавляем в head
        document.head.appendChild(script);
        
        console.info('✅ Schema.org data loaded successfully');
    }
}

// Отложенный запуск для лучшей производительности на мобильных
document.addEventListener('DOMContentLoaded', () => {
    // Ждем завершения критического рендеринга
    if ('requestIdleCallback' in window) {
        // Используем idle callback для загрузки схемы в свободное время
        requestIdleCallback(() => {
            new SchemaLoader();
        }, { timeout: 1000 });
    } else {
        // Fallback для браузеров без поддержки requestIdleCallback
        setTimeout(() => {
            new SchemaLoader();
        }, 200);
    }
});

// Export для использования в модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchemaLoader;
}