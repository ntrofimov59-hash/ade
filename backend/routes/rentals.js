const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Получить все варианты аренды
router.get('/', (req, res) => {
    db.all('SELECT * FROM rentals ORDER BY type, name', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Получить аренду по типу (авто, байк, велосипед)
router.get('/type/:type', (req, res) => {
    const { type } = req.params;
    db.all('SELECT * FROM rentals WHERE type = ? AND available = 1', [type], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Создать объявление об аренде
router.post('/', (req, res) => {
    const { type, name, price_per_day, available, description, image } = req.body;
    
    if (!type || !name || !price_per_day) {
        res.status(400).json({ error: 'Тип, название и цена обязательны' });
        return;
    }

    const sql = `INSERT INTO rentals (type, name, price_per_day, available, description, image) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [type, name, price_per_day, available || 1, description, image], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            message: 'Транспорт добавлен! 🚗'
        });
    });
});

module.exports = router;