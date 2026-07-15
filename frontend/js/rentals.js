// Загрузка вариантов аренды
async function loadRentals(filters = {}) {
    try {
        const response = await fetch('/api/rentals');
        let rentals = await response.json();

        if (filters.type && filters.type !== 'all') {
            rentals = rentals.filter(r => r.type === filters.type);
        }

        renderRentals(rentals);
    } catch (error) {
        console.error('Ошибка загрузки аренды:', error);
        document.getElementById('rentalsContainer').innerHTML =
            '<div class="loading">❌ Ошибка загрузки транспорта</div>';
    }
}

function getEmojiForRentalType(type) {
    const emojis = {
        'car': '🚗',
        'bike': '🏍️',
        'bicycle': '🚲',
        'transfer': '🚐'
    };
    return emojis[type] || '🚙';
}

function getRentalTypeLabel(type) {
    const labels = {
        'car': 'Автомобиль',
        'bike': 'Байк',
        'bicycle': 'Велосипед',
        'transfer': 'Трансфер'
    };
    return labels[type] || type;
}

// Отображение карточек аренды
function renderRentals(rentals) {
    const container = document.getElementById('rentalsContainer');

    if (rentals.length === 0) {
        container.innerHTML = '<div class="loading">😕 Ничего не найдено</div>';
        return;
    }

    container.innerHTML = rentals.map(item => `
        <div class="card">
            <div class="card-image" style="${item.image
                ? `background-image:url('${item.image}');background-size:cover;background-position:center;`
                : 'background: linear-gradient(135deg, #667eea, #764ba2);'}">
                ${item.image ? '' : getEmojiForRentalType(item.type)}
            </div>
            <div class="card-content">
                <span class="tag">${getRentalTypeLabel(item.type)}</span>
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
                <div class="price">${item.price_per_day.toLocaleString()} ₽ / день</div>
                <div class="meta">
                    <span>${item.available ? '✅ Доступно' : '⛔ Недоступно'}</span>
                    <button class="btn-book" ${item.available ? '' : 'disabled'} onclick="bookRental(${item.id}, '${item.name}')">
                        Забронировать
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Бронирование транспорта
function bookRental(id, name) {
    const clientName = prompt('Введите ваше имя:');
    if (!clientName) return;
    const phone = prompt('Введите ваш телефон:');
    if (!phone) return;

    fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_name: clientName,
            user_phone: phone,
            service_type: 'rental',
            service_id: id,
            booking_date: new Date().toISOString().split('T')[0]
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(`✅ Заявка отправлена! ID: ${data.booking_id}\nТранспорт: ${name}`);
    })
    .catch(err => {
        alert('❌ Ошибка бронирования');
        console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadRentals();

    document.getElementById('applyFilters').addEventListener('click', () => {
        const type = document.getElementById('filterType').value;
        loadRentals({ type });
    });
});