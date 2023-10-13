const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

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
    // Здесь вы можете создать функциональность для отправки сообщения о нарушении и т.д.
    // В данном случае, я отправлю простое сообщение о нарушении.
    bot.sendMessage(chatId, 'Шаг 1 из 3: Ваше Имя?');

    bot.on('text', (msg) => {
        switch (user.step) {
            case 1:
                user.name = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 2 из 3: Ваше Фамилия?');
                break;

            case 2:
                user.surname = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 3 из 3: Чем вы занимаетесь (программист, маркетолог, дизайнер)?');
                break;


            case 3:
                user.speciality = msg.text;

                // Отправляем данные анкеты в вашу личку
                const yourChatId = process.env.MY_CHAT_ID; // Замените на ваш chat_id
                const username = msg.from.username; // Получаем username пользователя
                bot.sendMessage(chatId, `Новая анкета:\n\nИмя : ${user.name}\nФамилия: ${user.surname}\nВаша специальность: ${user.speciality}\nUsername: @${username}`);
                bot.sendMessage(chatId, 'Спасибо за заполнение анкеты!');
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const dataToSend = {
                    name: "Имя",
                    surname: "Фамилия",
                    speciality: "Специальность"
                };

                axios.post('http://localhost:3000/api/save-data/', dataToSend, config)
                    .then(response => {
                        // Обработка ответа от сервера (например, сообщения об успешном сохранении)
                        console.log(dataToSend);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                // Тут вы можете сохранить данные пользователя или выполнить другие действия
                // После завершения обработки, можно удалить данные о пользователе
                delete users[userId];
                break;




            default:
                bot.sendMessage(chatId, 'Неверный шаг. Пожалуйста, используйте команду /start, чтобы начать заново.');
                break;
        }
    })
});
// Запускаем бота
bot.on('polling_error', (error) => {
    console.error(error);
});

console.log('Бот запущен!');