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
                <div class="card-image" style="${tour.image 
                    ? `background-image:url('${tour.image}');background-size:cover;background-position:center;` 
                    : 'background: linear-gradient(135deg, #667eea, #764ba2);'}">
                    ${tour.image ? '' : getEmojiForType(tour.type)}
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
                <<div class="card-image" style="${guide.photo 
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
});// ==================== ТЕМНАЯ ТЕМА ====================
const themeToggle = document.getElementById('themeToggle');
let isDarkMode = false;

// Проверяем сохраненную тему
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
    isDarkMode = true;
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        this.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
        showToast('🌙 Включена темная тема', 'info');
    } else {
        this.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        showToast('☀️ Включена светлая тема', 'info');
    }
});

// ==================== TOAST УВЕДОМЛЕНИЯ ====================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Показываем
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Скрываем через 3 секунды
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== ПРОГРЕСС-БАР ====================
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
});

// ==================== ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== ПАРАЛЛАКС ЭФФЕКТ ====================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        if (slide.classList.contains('active')) {
            slide.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
});

// ==================== АНИМАЦИЯ ПРИ ПОЯВЛЕНИИ ====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

document.querySelectorAll('.card, .advantage-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ==================== УЛУЧШЕННЫЙ СЛАЙДЕР ====================
let slideInterval;

function startAutoSlide() {
    slideInterval = setInterval(() => changeSlide(1), 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Останавливаем слайдер при наведении
const slider = document.querySelector('.hero-slider');
if (slider) {
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
}

// ==================== УЛУЧШЕННОЕ БРОНИРОВАНИЕ ====================
// Обновляем функцию bookTour
window.bookTour = function(id, title) {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        // Заполняем поля
        document.getElementById('modalServiceType').value = 'tour';
        document.getElementById('modalComment').value = `Тур: ${title}`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showToast('📝 Заполните форму бронирования', 'info');
    } else {
        // Если нет модалки - используем старый способ
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
            showToast('✅ Бронирование создано! ID: ' + data.booking_id, 'success');
        })
        .catch(() => {
            showToast('❌ Ошибка бронирования', 'error');
        });
    }
};

// ==================== ПОДСКАЗКИ ====================
document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', function(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.dataset.tooltip;
        tooltip.style.cssText = `
            position: absolute;
            background: #2c3e50;
            color: white;
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
            transform: translateY(-100%);
            margin-top: -10px;
        `;
        this.style.position = 'relative';
        this.appendChild(tooltip);
    });
    
    el.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
    });
});

console.log('🎨 UX/UI улучшения загружены!');