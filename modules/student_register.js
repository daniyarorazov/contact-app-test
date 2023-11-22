const axios = require("axios");
const menu = require("./student_menu");
const users = {};
function student_register(msg, bot) {
    const chatId = msg.chat.id;
    let user = {};
    let timeDateStep = {step: 1};
    const userId = msg.from.id;
    user.chat_id = chatId;
    bot.sendMessage(chatId, 'Шаг 1 из 12: Ваше Имя').then(r => console.log(r));

    // Обработчик события 'text' для всего процесса анкеты
    function handleUserInput(msg) {
        switch (timeDateStep.step) {
            case 1:
                user.name = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 2 из 12: Ваша Фамилия').then(r => console.log(r));
                break;

            case 2:
                user.surname = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 3 из 12: В каком университете учитесь?');
                break;

            case 3:
                user.university = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 4 из 12: Какой курс, год обучения?');
                break;

            case 4:
                user.course_number = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 5 из 12: Какой факультет?');
                break;

            case 5:
                user.faculty = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 6 из 12: Какая специальность?');
                break;

            case 6:
                user.speciality = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 7 из 12: Расскажите о своей специальности подробнее в 2-3 предложениях');
                break;

            case 7:
                user.description_about_speciality = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 8 из 12: Ваши навыки');
                break;

            case 8:
                user.skills = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 9 из 12: Какие навыки вы хотели бы получить?');
                break;

            case 9:
                user.required_getting_skills = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 10 из 12: Готовы ли вы проходить практику бесплатно? (Да/Нет)');
                break;

            case 10:
                if ((msg.text).toLowerCase() === 'да') {
                    user.ready_practice_free = true;
                } else if ((msg.text).toLowerCase() === 'нет') {
                    user.ready_practice_free = false;
                } else {
                    user.ready_practice_free = true;
                }

                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 11 из 12: Ваш телефон');
                break;
            case 11:
                user.phone_number = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 12 из 12: Ваш email');
                break;
            case 12:
                user.email = msg.text;
                const username = msg.from.username;
                bot.sendMessage(chatId, `Новая анкета:
                    \nИмя: ${user.name}
                    \nФамилия: ${user.surname}
                    \nУниверситет: ${user.university}
                    \nКурс: ${user.course_number}
                    \nФакультет: ${user.faculty}
                    \nСпециальность: ${user.speciality}
                    \nОписание специальности: ${user.description_about_speciality}
                    \nНавыки: ${user.skills}
                    \nЖелаемые навыки: ${user.required_getting_skills}
                    \nГотовность к практике: ${user.ready_practice_free}
                    \nТелефон: ${user.phone_number}
                    \nEmail: ${user.email}
                    \nUsername: @${username}\n${userId}`);

                bot.sendMessage(chatId, 'Спасибо за заполнение анкеты!');
                menu(msg, bot);
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
                        console.log("Ошибка");
                        console.log(error);
                        console.log(user)
                    });

                // Удаление обработчика события 'text' после завершения анкеты
                bot.removeListener('text', handleUserInput);

                delete users[userId];
                timeDateStep.step = null;
                break;

            default:
                bot.sendMessage(chatId, 'Неверный шаг. Пожалуйста, используйте команду /start, чтобы начать заново.');
                break;
        }
    }

    // Добавление обработчика события 'text'
    bot.on('text', handleUserInput);
}

module.exports = student_register;