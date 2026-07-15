const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Получить все туры
router.get('/', (req, res) => {
    db.all('SELECT * FROM tours ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Получить тур по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM tours WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Тур не найден' });
            return;
        }
        res.json(row);
    });
});

// Создать тур (для админа)
router.post('/', (req, res) => {
    const { title, description, price, duration, type, image } = req.body;
    
    if (!title || !price) {
        res.status(400).json({ error: 'Название и цена обязательны' });
        return;
    }

    const sql = `INSERT INTO tours (title, description, price, duration, type, image) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [title, description, price, duration, type, image], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            message: 'Тур создан успешно! 🏔️'
        });
    });
});

module.exports = router;