const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Путь к файлу базы данных
const dbPath = path.join(__dirname, '../database.db');

// Создаем подключение
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к БД:', err.message);
    } else {
        console.log('✅ Подключено к SQLite базе данных');
        createTables();
    }
});

// Создаем таблицы
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS tours (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price INTEGER,
            duration TEXT,
            type TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS guides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT,
            experience INTEGER,
            rating REAL,
            phone TEXT,
            email TEXT,
            photo TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // НОВОЕ: если таблица guides уже существовала без колонки photo (старая база),
    // добавляем её отдельно. Если колонка уже есть — sqlite вернёт ошибку,
    // мы её просто игнорируем.
    db.run(`ALTER TABLE guides ADD COLUMN photo TEXT`, (err) => {
        // "duplicate column name" означает, что колонка уже добавлена — это нормально
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS rentals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            price_per_day INTEGER,
            available BOOLEAN DEFAULT 1,
            description TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            user_phone TEXT NOT NULL,
            user_email TEXT,
            service_type TEXT NOT NULL,
            service_id INTEGER,
            booking_date DATE,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('📋 Таблицы созданы/проверены');
    seedData();
}

// ==================== НОВОЕ: НАПОЛНЕНИЕ БАЗЫ РЕАЛЬНЫМ КОНТЕНТОМ ====================
// Добавляет тестовые данные только если таблица пустая — безопасно перезапускать сервер.
function seedData() {
    db.get('SELECT COUNT(*) as count FROM tours', (err, row) => {
        if (err || row.count > 0) return;

        const tours = [
            [
                'Восхождение на Эльбрус. Классический маршрут',
                'Пятидневное восхождение на высочайшую вершину Европы по классическому южному маршруту. Акклиматизация, ночёвка на "Бочках" на высоте 3800 м, штурм вершины с опытным инструктором. Подходит для тех, у кого уже есть базовый опыт треккинга в горах.',
                45000, '5 дней', 'climbing',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'Эльбрус для начинающих: акклиматизационный тур',
                'Трёхдневная программа для тех, кто хочет попробовать горы без полноценного восхождения: подъём на канатке, прогулка по леднику Гарабаши, ночёвка в приюте и виды на Эльбрус с высоты 3800 м.',
                22000, '3 дня', 'climbing',
                'https://images.unsplash.com/photo-1571863533956-01c88e79957e?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'Сырно-винный гастротур по Кавказу',
                'Дегустация фермерских сыров и вин у подножия гор: три семейные винодельни, сыроварня с дегустацией восьми сортов и ужин с местными блюдами кавказской кухни.',
                18000, '1 день', 'gastro',
                'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'Гастрономический уикенд: от чачи до хычинов',
                'Два дня в горных аулах: мастер-класс по приготовлению хычинов, дегустация домашней чачи и мёда, ужин у местных пастухов с видом на закат в горах.',
                27000, '2 дня', 'gastro',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'Треккинг к водопадам Чегемского ущелья',
                'Однодневный поход к каскаду Чегемских водопадов: живописные тропы, смотровые площадки над ущельем и пикник с видом на скалы.',
                6500, '1 день', 'trekking',
                'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'Треккинг "Долина нарзанов"',
                'Трёхдневный маршрут через альпийские луга к минеральным источникам: ночёвки в палатках, купание в горных реках и дегустация природного нарзана прямо из источника.',
                19500, '3 дня', 'trekking',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
            ]
        ];

        const tourSql = `INSERT INTO tours (title, description, price, duration, type, image) VALUES (?, ?, ?, ?, ?, ?)`;
        tours.forEach(t => db.run(tourSql, t));
        console.log('🏔️ Добавлены тестовые туры');
    });

    db.get('SELECT COUNT(*) as count FROM guides', (err, row) => {
        if (err || row.count > 0) return;

        const guides = [
            ['Алексей Морозов', 'Восхождения и высотный треккинг', 12, 4.9, '+7 (999) 111-22-33', 'alexey@adventure-tours.ru',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'],
            ['Мария Соколова', 'Гастрономические туры', 8, 4.8, '+7 (999) 222-33-44', 'maria@adventure-tours.ru',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'],
            ['Дмитрий Волков', 'Треккинг и семейные маршруты', 10, 4.7, '+7 (999) 333-44-55', 'dmitry@adventure-tours.ru',
                'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=400&q=80'],
            ['Ирина Ковалёва', 'Восхождения для начинающих', 6, 4.9, '+7 (999) 444-55-66', 'irina@adventure-tours.ru',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'],
            ['Георгий Абашидзе', 'Гастротуры и локальная кухня', 15, 5.0, '+7 (999) 555-66-77', 'george@adventure-tours.ru',
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'],
            ['Анна Петрова', 'Треккинг и фототуры', 7, 4.8, '+7 (999) 666-77-88', 'anna@adventure-tours.ru',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80']
        ];

        const guideSql = `INSERT INTO guides (name, specialty, experience, rating, phone, email, photo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        guides.forEach(g => db.run(guideSql, g));
        console.log('🧭 Добавлены тестовые гиды');
    });

    db.get('SELECT COUNT(*) as count FROM rentals', (err, row) => {
        if (err || row.count > 0) return;

        const rentals = [
            ['car', 'Toyota Land Cruiser Prado', 6500, 1,
                'Полноприводный внедорожник для горных дорог. Подходит для трансферов и самостоятельных поездок по перевалам.',
                'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=800&q=80'],
            ['car', 'УАЗ Патриот', 4200, 1,
                'Проходимый и неприхотливый внедорожник для сложных грунтовых дорог и подъездов к базовым лагерям.',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'],
            ['bike', 'Мотоцикл эндуро Honda CRF300L', 3200, 1,
                'Лёгкий эндуро для горных грунтовых дорог. Аренда со шлемом и защитной экипировкой.',
                'https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=800&q=80'],
            ['bike', 'Мотоцикл BMW GS 850', 5500, 0,
                'Мощный туристический мотоцикл для дальних маршрутов. Сейчас в обслуживании — доступен со следующей недели.',
                'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=800&q=80'],
            ['bicycle', 'Горный велосипед Trek Marlin 7', 1500, 1,
                'Надёжный горный байк для треккинговых маршрутов и грунтовых дорог в среднегорье.',
                'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
            ['bicycle', 'Электровелосипед Haibike Sduro', 2200, 1,
                'Электровелосипед с запасом хода 60 км — для тех, кто хочет проехать больше без лишней усталости.',
                'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80'],
            ['transfer', 'Микроавтобус Mercedes Sprinter', 8000, 1,
                'Групповой трансфер до базовых лагерей и обратно — до 12 человек с багажом для снаряжения.',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80']
        ];

        const rentalSql = `INSERT INTO rentals (type, name, price_per_day, available, description, image) VALUES (?, ?, ?, ?, ?, ?)`;
        rentals.forEach(r => db.run(rentalSql, r));
        console.log('🚗 Добавлены тестовые варианты аренды');
    });
}

module.exports = db;