// ==================== СЛАЙДЕР ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function changeSlide(direction) {
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// Автопрокрутка слайдера
if (slides.length > 0) {
    setInterval(() => changeSlide(1), 5000);
}

// ==================== ЗАГРУЗКА ТУРОВ ====================
async function loadPopularTours() {
    try {
        const response = await fetch('/api/tours');
        const tours = await response.json();
        const container = document.getElementById('toursPreview');
        
        // Берем только первые 3 тура
        const popular = tours.slice(0, 3);
        
        if (popular.length === 0) {
            container.innerHTML = '<div class="loading">Туры скоро появятся 🏔️</div>';
            return;
        }
        
        container.innerHTML = popular.map(tour => `
            <div class="card" onclick="location.href='tours.html'">
                <div class="card-image" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                    ${getEmojiForType(tour.type)}
                </div>
                <div class="card-content">
                    <span class="tag">${getTypeLabel(tour.type)}</span>
                    <h3>${tour.title}</h3>
                    <p>${tour.description || 'Увлекательное путешествие'}</p>
                    <div class="price">${tour.price.toLocaleString()} ₽</div>
                    <div class="meta">
                        <span>⏱️ ${tour.duration || 'По запросу'}</span>
                        <button class="btn-book" onclick="event.stopPropagation(); openBookingModal()">
                            Забронировать
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки туров:', error);
        document.getElementById('toursPreview').innerHTML = 
            '<div class="loading">❌ Ошибка загрузки</div>';
    }
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

// ==================== ЗАГРУЗКА ГИДОВ ====================
async function loadGuidesPreview() {
    try {
        const response = await fetch('/api/guides');
        const guides = await response.json();
        const container = document.getElementById('guidesPreviewGrid');
        
        const topGuides = guides.slice(0, 3);
        
        if (topGuides.length === 0) {
            container.innerHTML = '<div class="loading">Гиды скоро появятся 🧭</div>';
            return;
        }
        
        container.innerHTML = topGuides.map(guide => `
            <div class="card" onclick="location.href='guides.html'">
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
                        <button class="btn-book" onclick="event.stopPropagation(); openBookingModal()">
                            Забронировать
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки гидов:', error);
        document.getElementById('guidesPreviewGrid').innerHTML = 
            '<div class="loading">❌ Ошибка загрузки</div>';
    }
}

// ==================== СТАТИСТИКА С АНИМАЦИЕЙ ====================
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        let current = 0;
        const increment = Math.ceil(target / 50);
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + (target === 98 ? '%' : '+');
                clearInterval(interval);
            } else {
                stat.textContent = current + (target === 98 ? '%' : '');
            }
        }, 30);
    });
}

// ==================== МОДАЛЬНОЕ ОКНО ====================
function openBookingModal() {
    document.getElementById('bookingModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Закрытие по клику вне модалки
document.getElementById('bookingModal').addEventListener('click', function(e) {
    if (e.target === this) closeBookingModal();
});

// ==================== ОТПРАВКА ЗАЯВКИ ====================
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('modalName').value.trim();
    const phone = document.getElementById('modalPhone').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const serviceType = document.getElementById('modalServiceType').value;
    const date = document.getElementById('modalDate').value;
    const people = document.getElementById('modalPeople').value;
    const comment = document.getElementById('modalComment').value.trim();
    
    if (!name || !phone || !date) {
        alert('Пожалуйста, заполните обязательные поля!');
        return;
    }
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: name,
                user_phone: phone,
                user_email: email,
                service_type: serviceType,
                booking_date: date,
                people: people,
                comment: comment
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`✅ Заявка отправлена!\nНомер бронирования: ${data.booking_id}\nМы свяжемся с вами в ближайшее время.`);
            this.reset();
            closeBookingModal();
        } else {
            alert('❌ Ошибка отправки: ' + data.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Произошла ошибка при отправке. Попробуйте позже.');
    }
});

// ==================== БЫСТРОЕ БРОНИРОВАНИЕ ====================
document.getElementById('quickBookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('✅ Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    this.reset();
});

// ==================== ПРОВЕРКА СЕРВЕРА ====================
async function checkServer() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('✅ Сервер:', data.message);
        console.log('📡 API:', data.endpoints);
    } catch (error) {
        console.error('❌ Ошибка соединения с сервером:', error);
    }
}

// ==================== ЗАПУСК ПРИ ЗАГРУЗКЕ ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏔️ Adventure Tours загружен!');
    checkServer();
    loadPopularTours();
    loadGuidesPreview();
    
    // Анимация статистики с задержкой
    setTimeout(animateStats, 1000);
    
    // Анимация Bento элементов
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