// Загрузка гидов
async function loadGuides() {
    try {
        const response = await fetch('/api/guides');
        const guides = await response.json();
        renderGuides(guides);
    } catch (error) {
        console.error('Ошибка загрузки гидов:', error);
        document.getElementById('guidesContainer').innerHTML =
            '<div class="loading">❌ Ошибка загрузки гидов</div>';
    }
}

// Отображение гидов
function renderGuides(guides) {
    const container = document.getElementById('guidesContainer');

    if (guides.length === 0) {
        container.innerHTML = '<div class="loading">😕 Гиды не найдены</div>';
        return;
    }

    container.innerHTML = guides.map(guide => `
        <div class="card">
            <div class="card-image" style="${guide.photo
                ? `background-image:url('${guide.photo}');background-size:cover;background-position:center;`
                : 'background: linear-gradient(135deg, #667eea, #764ba2);'}">
                ${guide.photo ? '' : '🧭'}
            </div>
            <div class="card-content">
                <h3>${guide.name}</h3>
                <p><strong>${guide.specialty || 'Гид-проводник'}</strong></p>
                <div class="stars">${'⭐'.repeat(Math.round(guide.rating || 0))} ${guide.rating || 'Новый'}</div>
                <p>Опыт: ${guide.experience || 0} лет</p>
                <div class="meta">
                    <span>📞 ${guide.phone}</span>
                    <button class="btn-book" onclick="bookGuide(${guide.id}, '${guide.name}')">
                        Забронировать
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Бронирование гида
function bookGuide(id, name) {
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
            service_type: 'guide',
            service_id: id,
            booking_date: new Date().toISOString().split('T')[0]
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(`✅ Заявка отправлена! ID: ${data.booking_id}\nГид: ${name}`);
    })
    .catch(err => {
        alert('❌ Ошибка бронирования');
        console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadGuides();
});