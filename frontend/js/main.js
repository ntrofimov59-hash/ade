// Проверка соединения с сервером
async function checkServer() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('✅ Сервер:', data.message);
        console.log('🕐 Время:', data.timestamp);
        console.log('📡 Доступные API:', data.endpoints);
    } catch (error) {
        console.error('❌ Ошибка соединения с сервером:', error);
    }
}

// Загрузка статистики на главную
async function loadStats() {
    try {
        const [toursRes, guidesRes, rentalsRes] = await Promise.all([
            fetch('/api/tours'),
            fetch('/api/guides'),
            fetch('/api/rentals')
        ]);
        
        const tours = await toursRes.json();
        const guides = await guidesRes.json();
        const rentals = await rentalsRes.json();
        
        // Обновляем статистику в Bento блоках (если есть)
        console.log(`📊 Статистика: ${tours.length} туров, ${guides.length} гидов, ${rentals.length} вариантов аренды`);
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏔️ Adventure Tours загружен!');
    checkServer();
    loadStats();
    
    // Анимация для Bento элементов
    const items = document.querySelectorAll('.bento-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});