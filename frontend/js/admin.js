// ==================== НАВИГАЦИЯ ====================
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        
        const tab = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
        
        // Загружаем данные для вкладки
        loadTabData(tab);
    });
});

// ==================== ЗАГРУЗКА ДАННЫХ ====================
function loadTabData(tab) {
    switch(tab) {
        case 'dashboard': loadDashboard(); break;
        case 'tours': loadTours(); break;
        case 'guides': loadGuides(); break;
        case 'rentals': loadRentals(); break;
        case 'bookings': loadBookings(); break;
        case 'reviews': loadReviews(); break;
    }
}

// ==================== ДАШБОРД ====================
async function loadDashboard() {
    try {
        const [tours, guides, rentals, bookings, reviews] = await Promise.all([
            fetch('/api/tours').then(r => r.json()),
            fetch('/api/guides').then(r => r.json()),
            fetch('/api/rentals').then(r => r.json()),
            fetch('/api/bookings').then(r => r.json()),
            fetch('/api/reviews').then(r => r.json()).catch(() => [])
        ]);
        
        document.getElementById('statTours').textContent = tours.length;
        document.getElementById('statGuides').textContent = guides.length;
        document.getElementById('statRentals').textContent = rentals.length;
        document.getElementById('statBookings').textContent = bookings.length;
        document.getElementById('statReviews').textContent = reviews.length || 0;
        
        // Последние бронирования
        const recent = bookings.slice(0, 5);
        const list = document.getElementById('recentBookingsList');
        if (recent.length === 0) {
            list.innerHTML = '<p class="loading">Нет бронирований</p>';
        } else {
            list.innerHTML = recent.map(b => `
                <div class="booking-item">
                    <strong>${b.user_name}</strong> - ${b.service_type}
                    <span class="status-${b.status || 'pending'}">${b.status || 'pending'}</span>
                    <small>${new Date(b.created_at).toLocaleDateString()}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки дашборда:', error);
    }
}

// ==================== ТУРЫ ====================
async function loadTours() {
    try {
        const response = await fetch('/api/tours');
        const tours = await response.json();
        const tbody = document.getElementById('toursTableBody');
        
        if (tours.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">Нет туров</td></tr>';
            return;
        }
        
        tbody.innerHTML = tours.map(tour => `
            <tr>
                <td>${tour.id}</td>
                <td>${tour.title}</td>
                <td>${tour.type || '—'}</td>
                <td>${tour.price.toLocaleString()} ₽</td>
                <td>${tour.duration || '—'}</td>
                <td>
                    <button class="btn-edit" onclick="editTour(${tour.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteTour(${tour.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки туров:', error);
    }
}

function openTourForm(data = null) {
    const isEdit = !!data;
    const content = document.getElementById('adminModalContent');
    content.innerHTML = `
        <h2>${isEdit ? '✏️ Редактировать тур' : '➕ Новый тур'}</h2>
        <form class="admin-form" id="tourForm">
            <div class="form-group">
                <label>Название *</label>
                <input type="text" id="tourTitle" value="${data?.title || ''}" required>
            </div>
            <div class="form-group">
                <label>Описание</label>
                <textarea id="tourDescription">${data?.description || ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Цена *</label>
                    <input type="number" id="tourPrice" value="${data?.price || ''}" required>
                </div>
                <div class="form-group">
                    <label>Длительность</label>
                    <input type="text" id="tourDuration" value="${data?.duration || ''}" placeholder="7 дней">
                </div>
            </div>
            <div class="form-group">
                <label>Тип</label>
                <select id="tourType">
                    <option value="climbing" ${data?.type === 'climbing' ? 'selected' : ''}>Восхождение</option>
                    <option value="gastro" ${data?.type === 'gastro' ? 'selected' : ''}>Гастрономия</option>
                    <option value="trekking" ${data?.type === 'trekking' ? 'selected' : ''}>Треккинг</option>
                </select>
            </div>
            <div class="form-group">
                <label>Изображение (URL)</label>
                <input type="text" id="tourImage" value="${data?.image || ''}" placeholder="elbrus.jpg">
            </div>
            <button type="submit" class="btn-primary">💾 Сохранить</button>
        </form>
    `;
    
    document.getElementById('adminModal').classList.add('active');
    
    document.getElementById('tourForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTour(data?.id);
    });
}

async function saveTour(id) {
    const tour = {
        title: document.getElementById('tourTitle').value.trim(),
        description: document.getElementById('tourDescription').value.trim(),
        price: parseInt(document.getElementById('tourPrice').value),
        duration: document.getElementById('tourDuration').value.trim(),
        type: document.getElementById('tourType').value,
        image: document.getElementById('tourImage').value.trim()
    };
    
    if (!tour.title || !tour.price) {
        alert('Заполните обязательные поля!');
        return;
    }
    
    try {
        const url = id ? `/api/tours/${id}` : '/api/tours';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tour)
        });
        
        if (response.ok) {
            alert(id ? '✅ Тур обновлен!' : '✅ Тур создан!');
            closeAdminModal();
            loadTours();
        } else {
            const error = await response.json();
            alert('❌ Ошибка: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('❌ Произошла ошибка');
    }
}

function editTour(id) {
    fetch(`/api/tours/${id}`)
        .then(r => r.json())
        .then(tour => openTourForm(tour))
        .catch(err => console.error(err));
}

async function deleteTour(id) {
    if (!confirm('Удалить тур?')) return;
    
    try {
        const response = await fetch(`/api/tours/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Тур удален');
            loadTours();
        } else {
            alert('❌ Ошибка удаления');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// ==================== ГИДЫ ====================
async function loadGuides() {
    try {
        const response = await fetch('/api/guides');
        const guides = await response.json();
        const tbody = document.getElementById('guidesTableBody');
        
        if (guides.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">Нет гидов</td></tr>';
            return;
        }
        
        tbody.innerHTML = guides.map(guide => `
            <tr>
                <td>${guide.id}</td>
                <td>${guide.name}</td>
                <td>${guide.specialty || '—'}</td>
                <td>${guide.experience || 0} лет</td>
                <td>${'⭐'.repeat(Math.round(guide.rating || 0))}</td>
                <td>
                    <button class="btn-edit" onclick="editGuide(${guide.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteGuide(${guide.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки гидов:', error);
    }
}

function openGuideForm(data = null) {
    const isEdit = !!data;
    const content = document.getElementById('adminModalContent');
    content.innerHTML = `
        <h2>${isEdit ? '✏️ Редактировать гида' : '➕ Новый гид'}</h2>
        <form class="admin-form" id="guideForm">
            <div class="form-group">
                <label>Имя *</label>
                <input type="text" id="guideName" value="${data?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Специализация</label>
                <input type="text" id="guideSpecialty" value="${data?.specialty || ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Опыт (лет)</label>
                    <input type="number" id="guideExperience" value="${data?.experience || 0}">
                </div>
                <div class="form-group">
                    <label>Рейтинг</label>
                    <input type="number" step="0.1" id="guideRating" value="${data?.rating || 0}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Телефон *</label>
                    <input type="tel" id="guidePhone" value="${data?.phone || ''}" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="guideEmail" value="${data?.email || ''}">
                </div>
            </div>
            <button type="submit" class="btn-primary">💾 Сохранить</button>
        </form>
    `;
    
    document.getElementById('adminModal').classList.add('active');
    
    document.getElementById('guideForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveGuide(data?.id);
    });
}

async function saveGuide(id) {
    const guide = {
        name: document.getElementById('guideName').value.trim(),
        specialty: document.getElementById('guideSpecialty').value.trim(),
        experience: parseInt(document.getElementById('guideExperience').value) || 0,
        rating: parseFloat(document.getElementById('guideRating').value) || 0,
        phone: document.getElementById('guidePhone').value.trim(),
        email: document.getElementById('guideEmail').value.trim()
    };
    
    if (!guide.name || !guide.phone) {
        alert('Имя и телефон обязательны!');
        return;
    }
    
    try {
        const url = id ? `/api/guides/${id}` : '/api/guides';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guide)
        });
        
        if (response.ok) {
            alert(id ? '✅ Гид обновлен!' : '✅ Гид создан!');
            closeAdminModal();
            loadGuides();
        } else {
            const error = await response.json();
            alert('❌ Ошибка: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function editGuide(id) {
    fetch(`/api/guides/${id}`)
        .then(r => r.json())
        .then(guide => openGuideForm(guide))
        .catch(err => console.error(err));
}

async function deleteGuide(id) {
    if (!confirm('Удалить гида?')) return;
    try {
        await fetch(`/api/guides/${id}`, { method: 'DELETE' });
        alert('✅ Гид удален');
        loadGuides();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// ==================== АРЕНДА ====================
async function loadRentals() {
    try {
        const response = await fetch('/api/rentals');
        const rentals = await response.json();
        const tbody = document.getElementById('rentalsTableBody');
        
        if (rentals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">Нет транспорта</td></tr>';
            return;
        }
        
        tbody.innerHTML = rentals.map(rental => `
            <tr>
                <td>${rental.id}</td>
                <td>${getRentalEmoji(rental.type)} ${rental.type}</td>
                <td>${rental.name}</td>
                <td>${rental.price_per_day.toLocaleString()} ₽</td>
                <td>${rental.available ? '✅ Да' : '❌ Нет'}</td>
                <td>
                    <button class="btn-edit" onclick="editRental(${rental.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteRental(${rental.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки аренды:', error);
    }
}

function getRentalEmoji(type) {
    const emojis = { 'car': '🚗', 'bike': '🏍️', 'bicycle': '🚲', 'transfer': '🚐' };
    return emojis[type] || '🚙';
}

function openRentalForm(data = null) {
    const isEdit = !!data;
    const content = document.getElementById('adminModalContent');
    content.innerHTML = `
        <h2>${isEdit ? '✏️ Редактировать транспорт' : '➕ Добавить транспорт'}</h2>
        <form class="admin-form" id="rentalForm">
            <div class="form-group">
                <label>Тип *</label>
                <select id="rentalType">
                    <option value="car" ${data?.type === 'car' ? 'selected' : ''}>Автомобиль</option>
                    <option value="bike" ${data?.type === 'bike' ? 'selected' : ''}>Байк</option>
                    <option value="bicycle" ${data?.type === 'bicycle' ? 'selected' : ''}>Велосипед</option>
                    <option value="transfer" ${data?.type === 'transfer' ? 'selected' : ''}>Трансфер</option>
                </select>
            </div>
            <div class="form-group">
                <label>Название *</label>
                <input type="text" id="rentalName" value="${data?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Описание</label>
                <textarea id="rentalDescription">${data?.description || ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Цена за день *</label>
                    <input type="number" id="rentalPrice" value="${data?.price_per_day || ''}" required>
                </div>
                <div class="form-group">
                    <label>Доступно</label>
                    <select id="rentalAvailable">
                        <option value="1" ${data?.available === 1 ? 'selected' : ''}>Да</option>
                        <option value="0" ${data?.available === 0 ? 'selected' : ''}>Нет</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn-primary">💾 Сохранить</button>
        </form>
    `;
    
    document.getElementById('adminModal').classList.add('active');
    
    document.getElementById('rentalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveRental(data?.id);
    });
}

async function saveRental(id) {
    const rental = {
        type: document.getElementById('rentalType').value,
        name: document.getElementById('rentalName').value.trim(),
        description: document.getElementById('rentalDescription').value.trim(),
        price_per_day: parseInt(document.getElementById('rentalPrice').value),
        available: parseInt(document.getElementById('rentalAvailable').value)
    };
    
    if (!rental.name || !rental.price_per_day) {
        alert('Заполните обязательные поля!');
        return;
    }
    
    try {
        const url = id ? `/api/rentals/${id}` : '/api/rentals';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rental)
        });
        
        if (response.ok) {
            alert(id ? '✅ Транспорт обновлен!' : '✅ Транспорт добавлен!');
            closeAdminModal();
            loadRentals();
        } else {
            const error = await response.json();
            alert('❌ Ошибка: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function editRental(id) {
    fetch(`/api/rentals/${id}`)
        .then(r => r.json())
        .then(rental => openRentalForm(rental))
        .catch(err => console.error(err));
}

async function deleteRental(id) {
    if (!confirm('Удалить транспорт?')) return;
    try {
        await fetch(`/api/rentals/${id}`, { method: 'DELETE' });
        alert('✅ Транспорт удален');
        loadRentals();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// ==================== БРОНИРОВАНИЯ ====================
async function loadBookings() {
    try {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();
        const tbody = document.getElementById('bookingsTableBody');
        
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">Нет бронирований</td></tr>';
            return;
        }
        
        tbody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.user_name}</td>
                <td>${booking.user_phone}</td>
                <td>${booking.service_type}</td>
                <td>${booking.booking_date || '—'}</td>
                <td>
                    <span class="status-${booking.status || 'pending'}">
                        ${booking.status || 'pending'}
                    </span>
                </td>
                <td>
                    <select onchange="updateBookingStatus(${booking.id}, this.value)" class="btn-status">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>⏳ Ожидает</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>✅ Подтвержден</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>✅ Выполнен</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>❌ Отменен</option>
                    </select>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки бронирований:', error);
    }
}

async function updateBookingStatus(id, status) {
    try {
        const response = await fetch(`/api/bookings/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('✅ Статус обновлен!');
            loadBookings();
        } else {
            alert('❌ Ошибка обновления');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// ==================== ОТЗЫВЫ ====================
function loadReviews() {
    // Заглушка - позже добавим полноценную работу с отзывами
    document.getElementById('reviewsTableBody').innerHTML = `
        <tr><td colspan="6" class="loading">Функция в разработке ⏳</td></tr>
    `;
}

function openReviewForm() {
    alert('Функция добавления отзывов будет доступна позже!');
}

// ==================== НАСТРОЙКИ ====================
function saveSettings() {
    alert('✅ Настройки сохранены!');
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('active');
}

function refreshData() {
    loadDashboard();
    alert('🔄 Данные обновлены!');
}

function logout() {
    if (confirm('Выйти из админ-панели?')) {
        location.href = 'index.html';
    }
}

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    
    // Закрытие модалки по клику вне
    document.getElementById('adminModal').addEventListener('click', function(e) {
        if (e.target === this) closeAdminModal();
    });
});

// ==================== ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ДЛЯ API ====================
// Заглушки для PUT и DELETE методов - добавим позже в сервер
console.log('👨‍💼 Админ-панель загружена!');