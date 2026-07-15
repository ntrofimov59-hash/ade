const db = require('./config/database');

// Добавляем тестовые туры
const tours = [
    ['Восхождение на Эльбрус', 'Южный маршрут, 7 дней', 45000, '7 дней', 'climbing', 'elbrus.jpg'],
    ['Гастротур по Кавказу', 'Дегустация сыров и вин', 25000, '3 дня', 'gastro', 'gastro.jpg'],
    ['Треккинг в горах', 'Джип-тур и пешие прогулки', 18000, '5 дней', 'trekking', 'trekking.jpg']
];

// Добавляем тестовых гидов
const guides = [
    ['Алексей Иванов', 'Альпинизм, скалолазание', 12, 4.9, '+7 999 123-45-67', 'alex@guide.ru'],
    ['Мария Петрова', 'Гастрономия, этнография', 8, 4.8, '+7 999 234-56-78', 'maria@guide.ru'],
    ['Сергей Козлов', 'Внедорожные туры', 10, 4.7, '+7 999 345-67-89', 'sergey@guide.ru']
];

// Добавляем тестовую аренду
const rentals = [
    ['car', 'Toyota Land Cruiser', 8000, 1, 'Внедорожник для гор', 'cruiser.jpg'],
    ['car', 'Mitsubishi Pajero', 7000, 1, 'Надежный внедорожник', 'pajero.jpg'],
    ['bike', 'KTM 500 EXC', 5000, 1, 'Эндуро для бездорожья', 'ktm.jpg'],
    ['bicycle', 'Merida Big Nine', 2000, 1, 'Горный велосипед', 'merida.jpg'],
    ['transfer', 'Mercedes V-Class', 15000, 1, 'Трансфер до 8 человек', 'mercedes.jpg']
];

// Вставляем данные
function seedDatabase() {
    // Очищаем таблицы
    db.run('DELETE FROM tours');
    db.run('DELETE FROM guides');
    db.run('DELETE FROM rentals');

    // Вставляем туры
    tours.forEach(tour => {
        db.run(`INSERT INTO tours (title, description, price, duration, type, image) 
                VALUES (?, ?, ?, ?, ?, ?)`, tour);
    });

    // Вставляем гидов
    guides.forEach(guide => {
        db.run(`INSERT INTO guides (name, specialty, experience, rating, phone, email) 
                VALUES (?, ?, ?, ?, ?, ?)`, guide);
    });

    // Вставляем аренду
    rentals.forEach(rental => {
        db.run(`INSERT INTO rentals (type, name, price_per_day, available, description, image) 
                VALUES (?, ?, ?, ?, ?, ?)`, rental);
    });

    console.log('✅ Тестовые данные добавлены!');
}

// Запускаем наполнение
setTimeout(seedDatabase, 1000);