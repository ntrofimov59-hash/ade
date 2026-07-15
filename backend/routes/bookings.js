const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Создать бронирование
router.post('/', (req, res) => {
    const { user_name, user_phone, user_email, service_type, service_id, booking_date } = req.body;
    
    if (!user_name || !user_phone || !service_type) {
        res.status(400).json({ error: 'Имя, телефон и тип услуги обязательны' });
        return;
    }

    const sql = `INSERT INTO bookings (user_name, user_phone, user_email, service_type, service_id, booking_date) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [user_name, user_phone, user_email, service_type, service_id, booking_date], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            message: 'Бронирование создано! ✅',
            booking_id: this.lastID
        });
    });
});

// Получить все бронирования (для админа)
router.get('/', (req, res) => {
    db.all('SELECT * FROM bookings ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Обновить статус бронирования
router.patch('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        res.status(400).json({ error: 'Некорректный статус' });
        return;
    }

    db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Бронирование не найдено' });
            return;
        }
        res.json({ message: 'Статус обновлен! 📌' });
    });
});

module.exports = router;