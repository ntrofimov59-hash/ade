// Загрузка туров
async function loadTours(filters = {}) {
    try {
        const response = await fetch('/api/tours');
        let tours = await response.json();
        
        // Применяем фильтры
        if (filters.type && filters.type !== 'all') {
            tours = tours.filter(t => t.type === filters.type);
        }
        if (filters.maxPrice) {
            tours = tours.filter(t => t.price <= parseInt(filters.maxPrice));
        }
        
        renderTours(tours);
    } catch (error) {
        console.error('Ошибка загрузки туров:', error);
        document.getElementById('toursContainer').innerHTML = 
            '<div class="loading">❌ Ошибка загрузки туров</div>';
    }
}

// Отображение туров
function renderTours(tours) {
    const container = document.getElementById('toursContainer');
    
    if (tours.length === 0) {
        container.innerHTML = '<div class="loading">😕 Туры не найдены</div>';
        return;
    }
    
    container.innerHTML = tours.map(tour => `
        <div class="card">
            <div class="card-image">
                ${getEmojiForType(tour.type)}
            </div>
            <div class="card-content">
                <span class="tag">${getTypeLabel(tour.type)}</span>
                <h3>${tour.title}</h3>
                <p>${tour.description || 'Увлекательное путешествие'}</p>
                <div class="price">${tour.price.toLocaleString()} ₽</div>
                <div class="meta">
                    <span>⏱️ ${tour.duration || 'По запросу'}</span>
                    <button class="btn-book" onclick="bookTour(${tour.id}, '${tour.title}')">
                        Забронировать
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getEmojiForType(type) {
    const emojis = {
        'climbing': '🏔️',
        'gastro': '🍷',
        'trekking': '🥾'
    };
    return emojis[type] || '🌍';
}

function getTypeLabel(type) {
    const labels = {
        'climbing': 'Восхождение',
        'gastro': 'Гастрономия',
        'trekking': 'Треккинг'
    };
    return labels[type] || type;
}

// Бронирование тура
function bookTour(id, title) {
    const name = prompt('Введите ваше имя:');
    if (!name) return;
    const phone = prompt('Введите ваш телефон:');
    if (!phone) return;
    
    fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_name: name,
            user_phone: phone,
            service_type: 'tour',
            service_id: id,
            booking_date: new Date().toISOString().split('T')[0]
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(`✅ Бронирование создано! ID: ${data.booking_id}\nТур: ${title}`);
        console.log('Бронирование:', data);
    })
    .catch(err => {
        alert('❌ Ошибка бронирования');
        console.error(err);
    });
}

// Фильтры
document.addEventListener('DOMContentLoaded', () => {
    loadTours();
    
    document.getElementById('applyFilters').addEventListener('click', () => {
        const type = document.getElementById('filterType').value;
        const maxPrice = document.getElementById('filterPrice').value;
        
        loadTours({
            type: type,
            maxPrice: maxPrice || null
        });
    });
});