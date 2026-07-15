console.log('✅ Админ-панель загружена');

document.addEventListener('DOMContentLoaded', function() {
    // Навигация
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            const tab = this.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            const target = document.getElementById(tab);
            if (target) target.classList.add('active');
            loadTabData(tab);
        });
    });

    // Кнопки
    document.getElementById('addTourBtn').addEventListener('click', () => openForm('tour'));
    document.getElementById('addGuideBtn').addEventListener('click', () => openForm('guide'));
    document.getElementById('addRentalBtn').addEventListener('click', () => openForm('rental'));
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('saveSettingsBtn').addEventListener('click', () => alert('✅ Сохранено'));
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('adminModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    loadDashboard();
});

function loadTabData(tab) {
    if (tab === 'dashboard') loadDashboard();
    else if (tab === 'tours') loadTours();
    else if (tab === 'guides') loadGuides();
    else if (tab === 'rentals') loadRentals();
    else if (tab === 'bookings') loadBookings();
}

async function loadDashboard() {
    try {
        const [tours, guides, rentals, bookings] = await Promise.all([
            fetch('/api/tours').then(r => r.json()).catch(() => []),
            fetch('/api/guides').then(r => r.json()).catch(() => []),
            fetch('/api/rentals').then(r => r.json()).catch(() => []),
            fetch('/api/bookings').then(r => r.json()).catch(() => [])
        ]);
        document.getElementById('statTours').textContent = tours.length;
        document.getElementById('statGuides').textContent = guides.length;
        document.getElementById('statRentals').textContent = rentals.length;
        document.getElementById('statBookings').textContent = bookings.length;
    } catch(e) { console.error(e); }
}

async function loadTours() {
    try {
        const data = await fetch('/api/tours').then(r => r.json());
        const tbody = document.getElementById('toursTableBody');
        if (!data.length) { tbody.innerHTML = '<tr><td colspan="6">Нет туров</td></tr>'; return; }
        tbody.innerHTML = data.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>${t.title}</td>
                <td>${t.type || '—'}</td>
                <td>${t.price ? t.price + ' ₽' : '—'}</td>
                <td>${t.duration || '—'}</td>
                <td>
                    <button class="btn-edit" data-id="${t.id}">✏️</button>
                    <button class="btn-delete" data-id="${t.id}">🗑️</button>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => editItem('tour', b.dataset.id)));
        tbody.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', () => deleteItem('tour', b.dataset.id)));
    } catch(e) { console.error(e); }
}

async function loadGuides() {
    try {
        const data = await fetch('/api/guides').then(r => r.json());
        const tbody = document.getElementById('guidesTableBody');
        if (!data.length) { tbody.innerHTML = '<tr><td colspan="6">Нет гидов</td></tr>'; return; }
        tbody.innerHTML = data.map(g => `
            <tr>
                <td>${g.id}</td>
                <td>${g.name}</td>
                <td>${g.specialty || '—'}</td>
                <td>${g.experience || 0} лет</td>
                <td>${'⭐'.repeat(Math.round(g.rating || 0))}</td>
                <td>
                    <button class="btn-edit" data-id="${g.id}">✏️</button>
                    <button class="btn-delete" data-id="${g.id}">🗑️</button>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => editItem('guide', b.dataset.id)));
        tbody.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', () => deleteItem('guide', b.dataset.id)));
    } catch(e) { console.error(e); }
}

async function loadRentals() {
    try {
        const data = await fetch('/api/rentals').then(r => r.json());
        const tbody = document.getElementById('rentalsTableBody');
        if (!data.length) { tbody.innerHTML = '<tr><td colspan="6">Нет транспорта</td></tr>'; return; }
        tbody.innerHTML = data.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.type}</td>
                <td>${r.name}</td>
                <td>${r.price_per_day ? r.price_per_day + ' ₽' : '—'}</td>
                <td>${r.available ? '✅ Да' : '❌ Нет'}</td>
                <td>
                    <button class="btn-edit" data-id="${r.id}">✏️</button>
                    <button class="btn-delete" data-id="${r.id}">🗑️</button>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => editItem('rental', b.dataset.id)));
        tbody.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', () => deleteItem('rental', b.dataset.id)));
    } catch(e) { console.error(e); }
}

async function loadBookings() {
    try {
        const data = await fetch('/api/bookings').then(r => r.json());
        const tbody = document.getElementById('bookingsTableBody');
        if (!data.length) { tbody.innerHTML = '<tr><td colspan="7">Нет бронирований</td></tr>'; return; }
        tbody.innerHTML = data.map(b => `
            <tr>
                <td>${b.id}</td>
                <td>${b.user_name}</td>
                <td>${b.user_phone}</td>
                <td>${b.service_type}</td>
                <td>${b.booking_date || '—'}</td>
                <td><span class="status-${b.status || 'pending'}">${b.status || 'pending'}</span></td>
                <td>
                    <select class="status-select" data-id="${b.id}">
                        <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Ожидает</option>
                        <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Подтвержден</option>
                        <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Выполнен</option>
                        <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Отменен</option>
                    </select>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('.status-select').forEach(s => s.addEventListener('change', function() {
            fetch(`/api/bookings/${this.dataset.id}/status`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({status: this.value})
            }).then(() => { alert('✅ Статус обновлен'); loadBookings(); });
        }));
    } catch(e) { console.error(e); }
}

function openForm(type, data = null) {
    const modal = document.getElementById('adminModal');
    const content = document.getElementById('adminModalContent');
    
    let fields = '';
    if (type === 'tour') {
        fields = `
            <div class="form-group"><label>Название</label><input type="text" id="f_title" value="${data?.title || ''}" required></div>
            <div class="form-group"><label>Описание</label><textarea id="f_desc">${data?.description || ''}</textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Цена</label><input type="number" id="f_price" value="${data?.price || ''}" required></div>
                <div class="form-group"><label>Длительность</label><input type="text" id="f_duration" value="${data?.duration || ''}" placeholder="7 дней"></div>
            </div>
            <div class="form-group"><label>Тип</label>
                <select id="f_type">
                    <option value="climbing" ${data?.type === 'climbing' ? 'selected' : ''}>Восхождение</option>
                    <option value="gastro" ${data?.type === 'gastro' ? 'selected' : ''}>Гастрономия</option>
                    <option value="trekking" ${data?.type === 'trekking' ? 'selected' : ''}>Треккинг</option>
                </select>
            </div>
        `;
    } else if (type === 'guide') {
        fields = `
            <div class="form-group"><label>Имя</label><input type="text" id="f_name" value="${data?.name || ''}" required></div>
            <div class="form-group"><label>Специализация</label><input type="text" id="f_specialty" value="${data?.specialty || ''}"></div>
            <div class="form-row">
                <div class="form-group"><label>Опыт</label><input type="number" id="f_experience" value="${data?.experience || 0}"></div>
                <div class="form-group"><label>Рейтинг</label><input type="number" step="0.1" id="f_rating" value="${data?.rating || 0}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Телефон</label><input type="tel" id="f_phone" value="${data?.phone || ''}" required></div>
                <div class="form-group"><label>Email</label><input type="email" id="f_email" value="${data?.email || ''}"></div>
            </div>
        `;
    } else if (type === 'rental') {
        fields = `
            <div class="form-group"><label>Тип</label>
                <select id="f_rental_type">
                    <option value="car" ${data?.type === 'car' ? 'selected' : ''}>Автомобиль</option>
                    <option value="bike" ${data?.type === 'bike' ? 'selected' : ''}>Байк</option>
                    <option value="bicycle" ${data?.type === 'bicycle' ? 'selected' : ''}>Велосипед</option>
                    <option value="transfer" ${data?.type === 'transfer' ? 'selected' : ''}>Трансфер</option>
                </select>
            </div>
            <div class="form-group"><label>Название</label><input type="text" id="f_rental_name" value="${data?.name || ''}" required></div>
            <div class="form-group"><label>Описание</label><textarea id="f_rental_desc">${data?.description || ''}</textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Цена за день</label><input type="number" id="f_rental_price" value="${data?.price_per_day || ''}" required></div>
                <div class="form-group"><label>Доступно</label>
                    <select id="f_rental_available">
                        <option value="1" ${data?.available === 1 ? 'selected' : ''}>Да</option>
                        <option value="0" ${data?.available === 0 ? 'selected' : ''}>Нет</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    content.innerHTML = `
        <h2>${data ? '✏️ Редактировать' : '➕ Добавить'}</h2>
        <form class="admin-form" id="editForm">
            ${fields}
            <button type="submit" class="btn-primary">💾 Сохранить</button>
        </form>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveItem(type, data?.id || null);
    });
}

async function saveItem(type, id) {
    let data = {};
    if (type === 'tour') {
        data = {
            title: document.getElementById('f_title').value.trim(),
            description: document.getElementById('f_desc').value.trim(),
            price: parseInt(document.getElementById('f_price').value),
            duration: document.getElementById('f_duration').value.trim(),
            type: document.getElementById('f_type').value,
            image: ''
        };
        if (!data.title || !data.price) { alert('Заполните название и цену'); return; }
    } else if (type === 'guide') {
        data = {
            name: document.getElementById('f_name').value.trim(),
            specialty: document.getElementById('f_specialty').value.trim(),
            experience: parseInt(document.getElementById('f_experience').value) || 0,
            rating: parseFloat(document.getElementById('f_rating').value) || 0,
            phone: document.getElementById('f_phone').value.trim(),
            email: document.getElementById('f_email').value.trim()
        };
        if (!data.name || !data.phone) { alert('Заполните имя и телефон'); return; }
    } else if (type === 'rental') {
        data = {
            type: document.getElementById('f_rental_type').value,
            name: document.getElementById('f_rental_name').value.trim(),
            description: document.getElementById('f_rental_desc').value.trim(),
            price_per_day: parseInt(document.getElementById('f_rental_price').value),
            available: parseInt(document.getElementById('f_rental_available').value),
            image: ''
        };
        if (!data.name || !data.price_per_day) { alert('Заполните название и цену'); return; }
    }
    
    try {
        const url = id ? `/api/${type}s/${id}` : `/api/${type}s`;
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert(id ? '✅ Обновлено!' : '✅ Создано!');
            closeModal();
            loadTabData(type + 's');
            loadDashboard();
        } else {
            const err = await response.json();
            alert('❌ Ошибка: ' + (err.error || 'Неизвестно'));
        }
    } catch(e) { console.error(e); alert('❌ Ошибка'); }
}

async function editItem(type, id) {
    const data = await fetch(`/api/${type}s/${id}`).then(r => r.json());
    openForm(type, data);
}

async function deleteItem(type, id) {
    if (!confirm('Удалить?')) return;
    await fetch(`/api/${type}s/${id}`, { method: 'DELETE' });
    alert('✅ Удалено');
    loadTabData(type + 's');
    loadDashboard();
}

function closeModal() {
    document.getElementById('adminModal').classList.remove('active');
    document.body.style.overflow = '';
}

function refreshData() {
    loadDashboard();
    alert('🔄 Обновлено');
}

function logout() {
    if (confirm('Выйти?')) location.href = 'index.html';
}

// Вызов для отзывов
document.getElementById('addReviewBtn')?.addEventListener('click', () => alert('⏳ В разработке'));