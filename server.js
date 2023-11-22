const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Порт, на котором будет работать сервер
const cors = require('cors');
require('dotenv').config();
// Подключение к базе данных PostgreSQL
const pgp = require('pg-promise')();
const { exec } = require('child_process');
const TelegramBot = require('node-telegram-bot-api');
app.use(cors());
const db = pgp({
    connectionString: 'postgresql://postgres:123123@127.0.0.1/mansap_telegram_database'
});
// Разрешить парсинг данных JSON
require('dotenv').config();
const axios = require('axios');

const start = require('./modules/start');
const student_register = require('./modules/student_register');
const company_register = require('./modules/company_register');

app.use(bodyParser.json());

const token = process.env.TELEGRAM_API_KEY

const bot = new TelegramBot(token, { polling: true });
module.exports = bot;

 // Запускаем бота
 bot.on('polling_error', (error) => {
    console.error(error);
});
console.log('Бот запущен!');


// Обработка POST-запроса
app.post('/api/save-data', (req, res) => {
    const dataToSave = req.body; // Получаем данные из POST-запроса

    // Вставка данных в базу данных
    db.none('INSERT INTO students (name, surname, speciality, phone_number, course_number, faculty, university, description_about_speciality, skills, required_getting_skills, ready_practice_free, chat_id, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [dataToSave.name, dataToSave.surname, dataToSave.speciality, dataToSave.phone_number, dataToSave.course_number, dataToSave.faculty, dataToSave.university, dataToSave.description_about_speciality, dataToSave.skills, dataToSave.required_getting_skills, dataToSave.ready_practice_free, dataToSave.chat_id, dataToSave.email])
        .then(() => {
            res.json({ message: 'Данные успешно сохранены', message2: dataToSave });
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
    db.any('SELECT * FROM students')
        .then(data => {
            const templateData = {
                events: data.map(item => {
                    return {
                        "id": item.id.toString(),
                        "name": item.name || "Unknown",
                        "surname": item.surname || "Unknown",
                        "phone_number": item.phone_number || "Unknown",
                        "university": item.university || "Unknown",
                        "course_number": item.course_number || "Unknown",
                        "faculty": item.faculty || "Unknown",
                        "speciality": item.speciality || "Unknown",
                        "description_about_speciality": item.description_about_speciality || "Unknown",
                        "skills": item.skills || "Unknown",
                        "required_getting_skills": item.required_getting_skills || "Unknown",
                        "ready_practice_free": item.ready_practice_free || "Unknown",
                        "chat_id": item.chat_id || "Unknown",
                        "email": item.email || "Unknown"
                    };
                })
            };

            res.json(templateData);
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            res.status(500).json({ error: 'Произошла ошибка при получении данных' });
        });
});

app.post('/send-message', (req, res) => {
      try {
        const chatId = req.body.chat_id;

      
        const interestMessage = `Кто-то проявил интерес! Хотите начать чат?`;
        const startChatLink = `tg://openmessage?user_id=${6444091658}`
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: 'Начать чат',
                callback_data: 'start_chat',
                url: startChatLink
              },
            ],
          ],
        };
      
        bot.sendMessage(chatId, interestMessage, {
          reply_markup: JSON.stringify(keyboard),
        });



        res.json({"message": "Success you know"})
      } catch(e) {
        res.json(e)
      }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const userId = 6444091658;

  if (query.data === 'start_chat') {
    // Ваш код для начала чата с пользователем
    bot.sendMessage(chatId, `Чат начат с пользователем ${userId}`);
  }
});




    const users = {};

  bot.onText(/\/start/, (msg) => {
      start(msg, bot);
  });

  bot.onText(/🎓 Я студент/, (msg) => {
      student_register(msg, bot);
  });

  bot.onText(/🚀 Я работодатель/, (msg) => {
      company_register(msg, bot);
  });


  bot.onText(/Заполнить анкету/, (msg) => {
      const chatId = msg.chat.id;
      let user = {step: 1};
      const userId = msg.from.id;
      user.chat_id = chatId;
      bot.sendMessage(chatId, 'Шаг 1 из 3: Ваше Имя').then(r => console.log(r));

      // Обработчик события 'text' для всего процесса анкеты
      function handleUserInput(msg) {
          switch (user.step) {
              case 1:
                  user.name = msg.text;
                  user.step++;
                  bot.sendMessage(chatId, 'Шаг 2 из 3: Ваша Фамилия').then(r => console.log(r));
                  break;

              case 2:
                  user.surname = msg.text;
                  user.step++;
                  bot.sendMessage(chatId, 'Шаг 3 из 3: Кем вы работаете?');
                  break;

              case 3:
                  user.speciality = msg.text;
                  const username = msg.from.username;
                  bot.sendMessage(chatId, `Новая анкета:\n\nИмя: ${user.name}\nФамилия: ${user.surname}\nСпециальность: ${user.speciality}\nUsername: @${username}\n${userId}`);
                  bot.sendMessage(chatId, 'Спасибо за заполнение анкеты!');
                  const config = {
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  };
                  axios.post('http://qosyl.me:3000/api/save-data/', user, config)
                      .then(response => {
                          console.log(response.data);
                      })
                      .catch(error => {
                          console.log(error);
                      });

                  // Удаление обработчика события 'text' после завершения анкеты
                  bot.removeListener('text', handleUserInput);

                  delete users[userId];
                  user.step = null;
                  break;

              default:
                  bot.sendMessage(chatId, 'Неверный шаг. Пожалуйста, используйте команду /start, чтобы начать заново.');
                  break;
          }
      }

      // Добавление обработчика события 'text'
      bot.on('text', handleUserInput);
  });

 


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});