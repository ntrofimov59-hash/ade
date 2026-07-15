// ==================== ОПРЕДЕЛЕНИЕ ЯЗЫКА ПО URL ====================
// Ожидаем чистые SEO-адреса вида /en/... или /ru/...
// Если префикса нет (например localhost:5000/) — берём язык браузера, по умолчанию ru.
function detectLang() {
    const path = window.location.pathname;
    if (path.startsWith('/en')) return 'en';
    if (path.startsWith('/ru')) return 'ru';

    const browserLang = (navigator.language || 'ru').slice(0, 2);
    return browserLang === 'en' ? 'en' : 'ru';
}

const CURRENT_LANG = detectLang();
let DICT = {};

// ==================== ЗАГРУЗКА СЛОВАРЯ ====================
async function loadDictionary() {
    const res = await fetch(`/i18n/${CURRENT_LANG}.json`);
    DICT = await res.json();
    applyTranslations();
    setupLanguageSwitcher();
}

// Достаём значение по пути вида "hero.slide1_title"
function t(key) {
    return key.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), DICT) || key;
}

// ==================== ПРИМЕНЕНИЕ ПЕРЕВОДОВ ====================
function applyTranslations() {
    document.documentElement.lang = CURRENT_LANG;

    if (DICT.meta) {
        document.title = DICT.meta.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', DICT.meta.description);
    }

    // Элементы с data-i18n="hero.slide1_title" — заменяем textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });

    // Элементы с data-i18n-html — для случаев с внутренней разметкой (эмодзи и т.п. можно и так, но оставим отдельно)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
}

// ==================== ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА В ШАПКЕ ====================
function setupLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    // Текущий путь без языкового префикса, чтобы переключение сохраняло текущую страницу
    const currentPath = window.location.pathname.replace(/^\/(en|ru)/, '') || '/';

    switcher.innerHTML = `
        <a href="/ru${currentPath}" class="${CURRENT_LANG === 'ru' ? 'lang-active' : ''}">RU</a>
        <span class="lang-sep">/</span>
        <a href="/en${currentPath}" class="${CURRENT_LANG === 'en' ? 'lang-active' : ''}">EN</a>
    `;
}

// ==================== ФОРМАТИРОВАНИЕ ЦЕНЫ ПОД ВАЛЮТУ ЯЗЫКА ====================
// Все цены в базе хранятся в рублях (RUB). Эта функция переводит их
// в валюту текущего языка для отображения на витрине.
// Использование в main.js/tours.js вместо `tour.price.toLocaleString() + ' ₽'`:
//     formatPrice(tour.price)
function formatPrice(priceInRub) {
    const currency = (DICT.currency) || { symbol: '₽', rate_from_rub: 1 };
    const converted = Math.round(priceInRub * currency.rate_from_rub);
    return `${converted.toLocaleString()} ${currency.symbol}`;
}
window.formatPrice = formatPrice;

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', loadDictionary);