const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/database'); 

// Импорт роутов
const toursRoutes = require('./routes/tours');
const guidesRoutes = require('./routes/guides');
const rentalsRoutes = require('./routes/rentals');
const bookingsRoutes = require('./routes/bookings');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API Роуты
app.use('/api/tours', toursRoutes);
app.use('/api/guides', guidesRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/bookings', bookingsRoutes);

// Тестовый маршрут
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Сервер работает! 🏔️',
        timestamp: new Date().toISOString(),
        endpoints: {
            tours: '/api/tours',
            guides: '/api/guides',
            rentals: '/api/rentals',
            bookings: '/api/bookings'
        }
    });
});

// ==================== ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ДЛЯ АДМИНКИ ====================

// PUT методы для обновления
app.put('/api/tours/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, price, duration, type, image } = req.body;
    
    const sql = `UPDATE tours SET title = ?, description = ?, price = ?, duration = ?, type = ?, image = ? WHERE id = ?`;
    
    db.run(sql, [title, description, price, duration, type, image, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Тур не найден' });
            return;
        }
        res.json({ message: 'Тур обновлен! 🏔️' });
    });
});

app.put('/api/guides/:id', (req, res) => {
    const { id } = req.params;
    const { name, specialty, experience, rating, phone, email } = req.body;
    
    const sql = `UPDATE guides SET name = ?, specialty = ?, experience = ?, rating = ?, phone = ?, email = ? WHERE id = ?`;
    
    db.run(sql, [name, specialty, experience, rating, phone, email, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Гид не найден' });
            return;
        }
        res.json({ message: 'Гид обновлен! 🧭' });
    });
});

app.put('/api/rentals/:id', (req, res) => {
    const { id } = req.params;
    const { type, name, price_per_day, available, description, image } = req.body;
    
    const sql = `UPDATE rentals SET type = ?, name = ?, price_per_day = ?, available = ?, description = ?, image = ? WHERE id = ?`;
    
    db.run(sql, [type, name, price_per_day, available, description, image, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Запись не найдена' });
            return;
        }
        res.json({ message: 'Транспорт обновлен! 🚗' });
    });
});

// DELETE методы
app.delete('/api/tours/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tours WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Тур не найден' });
            return;
        }
        res.json({ message: 'Тур удален! 🗑️' });
    });
});

app.delete('/api/guides/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM guides WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Гид не найден' });
            return;
        }
        res.json({ message: 'Гид удален! 🗑️' });
    });
});

app.delete('/api/rentals/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM rentals WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Запись не найдена' });
            return;
        }
        res.json({ message: 'Транспорт удален! 🗑️' });
    });
});

// API для отзывов (заглушка)
app.get('/api/reviews', (req, res) => {
    res.json([]);
});
// ==================== SEO: ЧПУ (Clean URLs) ====================
app.get('/tours', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/tours.html'));
});

app.get('/guides', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/guides.html'));
});

app.get('/rentals', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/rentals.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/blog.html'));
});

// ==================== SEO: Robots.txt ====================
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/robots.txt'));
});

// ==================== SEO: Sitemap.xml ====================
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/sitemap.xml'));
});
// ==================== Языковые версии (SEO clean URLs) ====================
// Любой /en/... или /ru/... отдаёт тот же файл, что и без префикса.
// Пример: /en/tours.html -> frontend/tours.html, /ru/ -> frontend/index.html
app.get(/^\/(en|ru)(\/.*)?$/, (req, res, next) => {
    const rest = req.params[1] || '/';
    const relativePath = rest === '/' ? 'index.html' : rest.slice(1);
    const filePath = path.join(__dirname, '../frontend', relativePath);

    res.sendFile(filePath, (err) => {
        if (err) next(); // файла нет — передаём дальше, получим обычный 404
    });
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📁 Frontend: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/health`);
});