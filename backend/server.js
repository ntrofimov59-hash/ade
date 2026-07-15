const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📁 Frontend: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/health`);
});