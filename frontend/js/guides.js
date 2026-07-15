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

function renderGuides(guides) {
    const container = document.getElementById('guidesContainer');
    
    if (guides.length === 0) {
        container.innerHTML = '<div class="loading">😕 Гиды не найдены</div>';
        return;
    }
    
    container.innerHTML = guides.map(guide => `
        <div class="card">
            <div class="card-image" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                🧭
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

function bookGuide(id, name) {
    const userName = prompt('Введите ваше имя:');
    if (!userName) return;
    const phone = prompt('Введите ваш телефон:');
    if (!phone) return;
    const date = prompt('Введите дату (ГГГГ-ММ-ДД):');
    if (!date) return;
    
    fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_name: userName,
            user_phone: phone,
            service_type: 'guide',
            service_id: id,
            booking_date: date
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(`✅ Гид ${name} забронирован! ID: ${data.booking_id}`);
    })
    .catch(err => {
        alert('❌ Ошибка бронирования');
        console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', loadGuides);