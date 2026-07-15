const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Получить всех гидов
router.get('/', (req, res) => {
    db.all('SELECT * FROM guides ORDER BY rating DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Получить гида по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM guides WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Гид не найден' });
            return;
        }
        res.json(row);
    });
});

// Создать гида
router.post('/', (req, res) => {
    const { name, specialty, experience, rating, phone, email } = req.body;
    
    if (!name || !phone) {
        res.status(400).json({ error: 'Имя и телефон обязательны' });
        return;
    }

    const sql = `INSERT INTO guides (name, specialty, experience, rating, phone, email) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [name, specialty, experience, rating, phone, email], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            message: 'Гид добавлен! 🧭'
        });
    });
});

module.exports = router;