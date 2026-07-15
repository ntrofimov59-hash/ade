// Проверка соединения с сервером
async function checkServer() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('✅ Сервер:', data.message);
        console.log('🕐 Время:', data.timestamp);
    } catch (error) {
        console.error('❌ Ошибка соединения с сервером:', error);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏔️ Adventure Tours загружен!');
    checkServer();
    
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