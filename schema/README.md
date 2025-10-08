# 📁 Schema.org File Structure

```
schema/
├── index.json              # Конфигурация системы схем
├── locales/                # Языковые версии схем
│   ├── schema-ru.json      # Основная русская схема
│   └── schema-en.json      # Английская схема
└── templates/              # Шаблоны для динамических схем
    ├── article.json        # Шаблон для статей
    ├── review.json         # Шаблон для обзоров VPN
    ├── coupons.json        # Шаблон для купонов
    └── faq.json            # Шаблон для FAQ
```

## 🔧 Использование

### Автоматическая загрузка
Добавьте в HTML:
```html
<script src="/js/schema-loader.js"></script>
```

### Прямое подключение
```html
<!-- Русская версия -->
<script type="application/ld+json" src="/schema/locales/schema-ru.json"></script>

<!-- Английская версия -->
<script type="application/ld+json" src="/schema/locales/schema-en.json"></script>
```

## 📊 Поддерживаемые типы
- Organization
- WebSite  
- Article
- Review
- FAQPage
- ItemList
- OfferCatalog
- BreadcrumbList
- ImageGallery