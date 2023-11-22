const menu = require("./company_menu");

function company_register(msg, bot) {
    const chatId = msg.chat.id;
    let user = {step: 1};
    const userId = msg.from.id;
    user.chat_id = chatId;
    bot.sendMessage(chatId, 'Шаг 1 из 4: Ваше Имя').then(r => console.log(r));

    // Обработчик события 'text' для всего процесса анкеты
    function handleUserInput(msg) {
        switch (user.step) {
            case 1:
                user.name = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 2 из 4: Ваша Фамилия').then(r => console.log(r));
                break;

            case 2:
                user.surname = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 3 из 4: В каком университете учитесь?');
                break;

            case 3:
                user.university = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 4 из 4: Какая у вас специальность?');
                break;

            case 4:
                user.speciality = msg.text;
                const username = msg.from.username;
                bot.sendMessage(chatId, `Новая анкета:\n\nИмя: ${user.name}\nФамилия: ${user.surname}\n Университет: ${user.university} \n Специальность: ${user.speciality}\nUsername: @${username}\n${userId}`);
                bot.sendMessage(chatId, 'Спасибо за заполнение анкеты!');
                menu(msg, bot);
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                // axios.post('http://qosyl.me:3000/api/save-data/', user, config)
                //     .then(response => {
                //         console.log(response.data);
                //     })
                //     .catch(error => {
                //         console.log(error);
                //     });

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
}

module.exports = company_register;