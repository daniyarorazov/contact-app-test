const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Порт, на котором будет работать сервер
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
// Подключение к базе данных PostgreSQL
const pgp = require('pg-promise')();
const { exec } = require('child_process');
app.use(cors());
const db = pgp({
    connectionString: 'postgresql://postgres:123123@127.0.0.1/contact_book'
});
// Разрешить парсинг данных JSON
app.use(bodyParser.json());
require('dotenv').config();
const TOKEN = process.env.TELEGRAM_API_KEY;

const bot = new TelegramBot(TOKEN, { polling: true });
// Обработка POST-запроса
app.post('/api/save-data', (req, res) => {
    const dataToSave = req.body; // Получаем данные из POST-запроса
    console.log(req.body)

    // Вставка данных в базу данных
    db.none('INSERT INTO contacts (name, surname, speciality, university, chat_id) VALUES ($1, $2, $3, $4, $5)', [dataToSave.name, dataToSave.surname, dataToSave.speciality, dataToSave.university, dataToSave.chat_id])
        .then(() => {
            res.json({ message: 'Данные успешно сохранены' });
        })
        .catch(error => {
            console.error('Ошибка при сохранении данных:', error);
            res.status(500).json({ error: 'Произошла ошибка при сохранении данных' });
        });
});
const commands = [
    'git pull origin main',
    'pm2 restart server',
    'npm run build',
  ];
  
  function executeCommandsSequentially(commands, currentIndex) {
    if (currentIndex < commands.length) {
      const command = commands[currentIndex];
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Ошибка выполнения команды: ${error}`);
          console.error(`stderr: ${stderr}`);
        } else {
          console.log(`stdout: ${stdout}`);
        }
        
        // Рекурсивно вызываем следующую команду
        executeCommandsSequentially(commands, currentIndex + 1);
      });
    }
  }
  
  // Начинаем выполнение команд с индекса 0
  
app.post('/api/deploy', (req, res) => {
    executeCommandsSequentially(commands, 0);
});

app.get('/test2', (req, res) => {
    res.send('Hello World!');
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

app.post('/send-message', (req, res) => {
    const chatId = req.query.chat_id; // Получите chat_id из параметра запроса
    const messageText = 'Привет, вашей анкетой были заинтересованы';

    // Отправьте сообщение в чат
    bot.sendMessage(chatId, messageText);

    res.json({ message: 'Сообщение отправлено' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});