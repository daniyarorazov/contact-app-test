const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Порт, на котором будет работать сервер

// Подключение к базе данных PostgreSQL
const pgp = require('pg-promise')();
const db = pgp({
    connectionString: 'postgresql://postgres:123123@localhost:5432/contact_book'
});

// Разрешить парсинг данных JSON
app.use(bodyParser.json());

// Обработка POST-запроса
app.post('/api/save-data', (req, res) => {
    const dataToSave = req.body; // Получаем данные из POST-запроса
    console.log(req.body)

    // Вставка данных в базу данных
    db.none('INSERT INTO contacts (name, surname, speciality) VALUES ($1, $2, $3)', [dataToSave.name, dataToSave.surname, dataToSave.speciality])
        .then(() => {
            res.json({ message: 'Данные успешно сохранены' });
        })
        .catch(error => {
            console.error('Ошибка при сохранении данных:', error);
            res.status(500).json({ error: 'Произошла ошибка при сохранении данных' });
        });
});

app.get('/api/get-data', (req, res) => {
    db.any('SELECT * FROM contacts')
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            res.status(500).json({ error: 'Произошла ошибка при получении данных' });
        });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});