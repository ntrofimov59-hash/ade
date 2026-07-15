const db = require('./config/database');

// ==================== РЕАЛЬНЫЕ ТУРЫ ====================
const tours = [
    {
        title: 'Восхождение на Эльбрус (южный маршрут)',
        description: `Классическое восхождение на высочайшую вершину Европы - гору Эльбрус (5642 м). 
        Программа включает акклиматизацию, обучение работе со снаряжением и восхождение под руководством опытных гидов. 
        Идеально для начинающих альпинистов.`,
        price: 55000,
        duration: '8 дней',
        type: 'climbing',
        image: 'elbrus.jpg'
    },
    {
        title: 'Гастрономический тур по Кавказу',
        description: `Путешествие по самым вкусным местам Кавказа. Дегустация знаменитых сыров, 
        посещение виноделен, знакомство с национальной кухней. Вы попробуете настоящий хачапури, 
        хинкали, сыры и домашнее вино.`,
        price: 35000,
        duration: '5 дней',
        type: 'gastro',
        image: 'gastro.jpg'
    },
    {
        title: 'Треккинг в горах Кавказа',
        description: `Пеший поход по живописным тропам Кавказских гор. Переходы через перевалы, 
        ночевки в палатках, незабываемые закаты и рассветы в горах. Маршрут средней сложности.`,
        price: 28000,
        duration: '6 дней',
        type: 'trekking',
        image: 'trekking.jpg'
    },
    {
        title: 'Восхождение на Казбек',
        description: `Техническое восхождение на одну из красивейших вершин Кавказа - гору Казбек (5033 м). 
        Требуется хорошая физическая подготовка и базовые навыки альпинизма.`,
        price: 48000,
        duration: '7 дней',
        type: 'climbing',
        image: 'kazbek.jpg'
    },
    {
        title: 'Экскурсия по горным аулам Дагестана',
        description: `Путешествие по древним аулам Дагестана. Знакомство с культурой, архитектурой и 
        традициями горских народов. Посещение старинных крепостей и смотровых площадок.`,
        price: 22000,
        duration: '4 дня',
        type: 'gastro',
        image: 'dagestan.jpg'
    },
    {
        title: 'Ски-тур по Приэльбрусью',
        description: `Комбинированный тур: восхождение на лыжах и сноуборде по живописным склонам. 
        Подходит для опытных лыжников и сноубордистов.`,
        price: 42000,
        duration: '7 дней',
        type: 'trekking',
        image: 'skitour.jpg'
    }
];

// ==================== РЕАЛЬНЫЕ ГИДЫ ====================
const guides = [
    {
        name: 'Алексей Иванов',
        specialty: 'Инструктор по альпинизму, горный гид',
        experience: 15,
        rating: 4.9,
        phone: '+7 999 111-22-33',
        email: 'alex@adventure-tours.ru'
    },
    {
        name: 'Мария Петрова',
        specialty: 'Гид-гастроном, этнограф',
        experience: 10,
        rating: 4.8,
        phone: '+7 999 222-33-44',
        email: 'maria@adventure-tours.ru'
    },
    {
        name: 'Сергей Козлов',
        specialty: 'Инструктор по треккингу, спасатель МЧС',
        experience: 12,
        rating: 4.9,
        phone: '+7 999 333-44-55',
        email: 'sergey@adventure-tours.ru'
    },
    {
        name: 'Елена Смирнова',
        specialty: 'Горный гид, фотограф',
        experience: 8,
        rating: 4.7,
        phone: '+7 999 444-55-66',
        email: 'elena@adventure-tours.ru'
    },
    {
        name: 'Дмитрий Волков',
        specialty: 'Инструктор по скалолазанию, гид-проводник',
        experience: 14,
        rating: 4.9,
        phone: '+7 999 555-66-77',
        email: 'dmitry@adventure-tours.ru'
    }
];

// ==================== РЕАЛЬНАЯ АРЕНДА ====================
const rentals = [
    {
        type: 'car',
        name: 'Toyota Land Cruiser 200',
        price_per_day: 12000,
        available: 1,
        description: 'Надежный внедорожник для любых горных дорог. Полный привод, клиренс 320 мм, кондиционер.'
    },
    {
        type: 'car',
        name: 'Mitsubishi Pajero Sport',
        price_per_day: 9000,
        available: 1,
        description: 'Комфортный внедорожник для семейных поездок по горам. 7 мест, багажник для снаряжения.'
    },
    {
        type: 'bike',
        name: 'KTM 500 EXC-F',
        price_per_day: 6500,
        available: 1,
        description: 'Мощный эндуро-байк для бездорожья. Подходит для опытных райдеров.'
    },
    {
        type: 'bike',
        name: 'Honda CRF 450L',
        price_per_day: 5500,
        available: 1,
        description: 'Надежный мотоцикл для горных маршрутов. Легкий, маневренный, с хорошей подвеской.'
    },
    {
        type: 'bicycle',
        name: 'Merida Big Nine 9000',
        price_per_day: 3500,
        available: 1,
        description: 'Профессиональный горный велосипед для треккинга. Карбоновая рама, двойная подвеска.'
    },
    {
        type: 'bicycle',
        name: 'Trek Fuel EX 8',
        price_per_day: 3000,
        available: 1,
        description: 'Современный эндуро-велосипед для сложных горных трасс.'
    },
    {
        type: 'transfer',
        name: 'Mercedes V-Class',
        price_per_day: 25000,
        available: 1,
        description: 'Комфортный минивэн для группы до 8 человек. Идеален для туристических групп.'
    },
    {
        type: 'transfer',
        name: 'Hyundai Staria',
        price_per_day: 18000,
        available: 1,
        description: 'Вместительный трансфер для 7 человек. Кондиционер, подогрев сидений.'
    }
];

// ==================== ЗАПОЛНЕНИЕ БАЗЫ ====================
function seedContent() {
    console.log('📝 Начинаем наполнение контентом...');
    
    // Очищаем таблицы
    db.run('DELETE FROM tours');
    db.run('DELETE FROM guides');
    db.run('DELETE FROM rentals');
    
    // Вставляем туры
    tours.forEach(tour => {
        const sql = `INSERT INTO tours (title, description, price, duration, type, image) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [tour.title, tour.description, tour.price, tour.duration, tour.type, tour.image]);
    });
    console.log(`✅ Добавлено ${tours.length} туров`);
    
    // Вставляем гидов
    guides.forEach(guide => {
        const sql = `INSERT INTO guides (name, specialty, experience, rating, phone, email) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [guide.name, guide.specialty, guide.experience, guide.rating, guide.phone, guide.email]);
    });
    console.log(`✅ Добавлено ${guides.length} гидов`);
    
    // Вставляем аренду
    rentals.forEach(rental => {
        const sql = `INSERT INTO rentals (type, name, price_per_day, available, description) 
                     VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [rental.type, rental.name, rental.price_per_day, rental.available, rental.description]);
    });
    console.log(`✅ Добавлено ${rentals.length} вариантов аренды`);
    
    console.log('🎉 База данных наполнена реальным контентом!');
}

// Запускаем с задержкой
setTimeout(seedContent, 1000);