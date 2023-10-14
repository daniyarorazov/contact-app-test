const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const bodyParser = require('body-parser');

require('dotenv').config();

const token = process.env.TELEGRAM_API_KEY

const bot = new TelegramBot(token, { polling: true });

const users = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Создаем клавиатуру с двумя кнопками
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['Заполнить анкету'],
            ],
            one_time_keyboard: true, // Одноразовая клавиатура
        },
    };

    bot.sendMessage(chatId, 'Добро пожаловать в бота контактной книжки! Тут вы сможете опубликовать свой контакт, чтобы остальные могли с вами связаться. Выберите действие:', keyboard);
});


bot.onText(/Заполнить анкету/, (msg) => {
    const chatId = msg.chat.id;
    let user = {step: 1};
    const userId = msg.from.id;
    user.chat_id = chatId;
    bot.sendMessage(chatId, 'Шаг 1 из 3: Ваше Имя');

    // Обработчик события 'text' для всего процесса анкеты
    function handleUserInput(msg) {

        switch (user.step) {
            case 1:
                user.name = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 2 из 3: Ваша Фамилия');
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

// Запускаем бота
bot.on('polling_error', (error) => {
    console.error(error);
});

console.log('Бот запущен!');