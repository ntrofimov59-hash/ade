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
            '<div class="loading">❌ Ошибка загрузки</div>';
    }
}

function renderRentals(rentals) {
    const container = document.getElementById('rentalsContainer');
    
    if (rentals.length === 0) {
        container.innerHTML = '<div class="loading">😕 Транспорт не найден</div>';
        return;
    }
    
    container.innerHTML = rentals.map(rental => `
        <div class="card">
            <div class="card-image" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
                ${getRentalEmoji(rental.type)}
            </div>
            <div class="card-content">
                <span class="tag">${getRentalLabel(rental.type)}</span>
                <h3>${rental.name}</h3>
                <p>${rental.description || 'В отличном состоянии'}</p>
                <div class="price">${rental.price_per_day.toLocaleString()} ₽/день</div>
                <div class="meta">
                    <span>${rental.available ? '✅ Доступно' : '❌ Занято'}</span>
                    <button class="btn-book" onclick="bookRental(${rental.id}, '${rental.name}')"
                            ${!rental.available ? 'disabled style="opacity:0.5"' : ''}>
                        ${rental.available ? 'Забронировать' : 'Недоступно'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getRentalEmoji(type) {
    const emojis = {
        'car': '🚗',
        'bike': '🏍️',
        'bicycle': '🚲',
        'transfer': '🚐'
    };
    return emojis[type] || '🚙';
}

function getRentalLabel(type) {
    const labels = {
        'car': 'Автомобиль',
        'bike': 'Байк',
        'bicycle': 'Велосипед',
        'transfer': 'Трансфер'
    };
    return labels[type] || type;
}

function bookRental(id, name) {
    const userName = prompt('Введите ваше имя:');
    if (!userName) return;
    const phone = prompt('Введите ваш телефон:');
    if (!phone) return;
    const days = prompt('На сколько дней?');
    if (!days || isNaN(days)) return;
    const date = prompt('Дата начала (ГГГГ-ММ-ДД):');
    if (!date) return;
    
    fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_name: userName,
            user_phone: phone,
            service_type: 'rental',
            service_id: id,
            booking_date: date,
            duration: days
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(`✅ ${name} забронирован на ${days} дней! ID: ${data.booking_id}`);
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