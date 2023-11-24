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
const view_own_company = require("./modules/view_own_company");

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

app.post('/api/save-data-company', (req, res) => {
    const dataToSave = req.body; // Получаем данные из POST-запроса

    // Вставка данных в базу данных
    db.none('INSERT INTO company (name_company, type_company, website_company, name_surname_role_person, ready_pay_intern, vacancy, chat_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
        dataToSave.name_company,
        dataToSave.type_company,
        dataToSave.website_company,
        dataToSave.name_surname_role_person,
        dataToSave.ready_pay_intern,
        dataToSave.vacancy,
        dataToSave.chat_id
    ])
        .then(() => {
            res.json({ message: 'Данные успешно сохранены', message2: dataToSave });
        })
        .catch(error => {
            console.error('Ошибка при сохранении данных:', error);
            res.status(500).json({ error: 'Произошла ошибка при сохранении данных' });
        });
});

const commands = [
    'git pull',
    'pm2 restart server',
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
  
app.post('/api/deploy', () => {
    executeCommandsSequentially(commands, 0);
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

app.get('/api/get-data-company', (req, res) => {
    db.any('SELECT * FROM company')
        .then(data => {
            const templateData = {
                events: data.map(item => {
                    return {
                        "id": item.id.toString(),
                        "name_company": item.name_company || "Unknown",
                        "type_company": item.type_company || "Unknown",
                        "website_company": item.website_company || "Unknown",
                        "name_surname_role_person": item.name_surname_role_person || "Unknown",
                        "ready_pay_intern": item.ready_pay_intern || "Unknown",
                        "vacancy": item.vacancy || "Unknown",
                        "chat_id": item.chat_id || "Unknown"
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

app.get('/user/:chat_id', (req, res) => {
    const chatId = parseInt(req.params.chat_id);

    // Замените на ваш запрос к базе данных
    db.any('SELECT * FROM company WHERE chat_id = $1', chatId.toString())
        .then(user => {
            if (user) {
                const userData = {
                    id: user.id.toString(),
                    name_company: user.name_company || 'Unknown',
                    type_company: user.type_company || 'Unknown',
                    website_company: user.website_company || 'Unknown',
                    name_surname_role_person: user.name_surname_role_person || 'Unknown',
                    ready_pay_intern: user.ready_pay_intern || 'Unknown',
                    vacancy: user.vacancy || 'Unknown',
                    chat_id: user.chat_id || 'Unknown',
                };

                res.json(userData);
            } else {
                res.status(404).json({ message: 'Пользователь не найден' });
            }
        })
        .catch(error => {
            console.error('Error retrieving user:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        });
});

app.get('/hello_world', (req, res) => {
    res.send('Hello World!');
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

  bot.onText(/📝 Посмотреть свою анкету компании/, (msg) => {
      view_own_company(msg, bot);
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

 


// Запуск сервера node js with port 3000
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});