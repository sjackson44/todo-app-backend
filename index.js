const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.get('/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/todos', (req, res) => {
    const { title, completed } = req.body;
    db.query('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, completed], (err, result) => {
        if (err) throw err;
        // Fetch the newly added todo item
        db.query('SELECT * FROM todos WHERE id = ?', [result.insertId], (err, rows) => {
            if (err) throw err;
            res.json(rows[0]); // Return the complete todo object
        });
    });
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    db.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
