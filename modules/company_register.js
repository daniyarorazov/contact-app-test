const menu = require("./company_menu");

function company_register(msg, bot) {
    const chatId = msg.chat.id;
    let user = {step: 1};
    const userId = msg.from.id;
    user.chat_id = chatId;
    bot.sendMessage(chatId, 'Шаг 1 из 6: Название компании').then(r => console.log(r));

    // Обработчик события 'text' для всего процесса анкеты
    function handleUserInput(msg) {
        switch (user.step) {
            case 1:
                user.name_company = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 2 из 6: Вид деятельности компании').then(r => console.log(r));
                break;

            case 2:
                user.type_company = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 3 из 6: Сайт компании ');
                break;

            case 3:
                user.website_company = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 4 из 6: Ваше Ф.И.О и  роль в компании');
                break;

            case 4:
                user.name_surname_role_person = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 5 из 6: Готовы ли вы оплачивать студентам практику? (Да/Нет)  ');
                break;

            case 5:
                user.ready_pay_intern = msg.text;
                user.step++;
                bot.sendMessage(chatId, 'Шаг 6 из 6: Горящие вакансии в вашей компании?');
                break;

            case 6:
                user.vacancy = msg.text;
                const username = msg.from.username;
                bot.sendMessage(chatId, `Новая анкета:\n
                Название компании: ${user.name_company}\n
                Тип компании: ${user.type_company}\n
                Веб-сайт компании: ${user.website_company}\n
                Имя-Фамилия-Роль сотрудника: ${user.name_surname_role_person}\n
                Готовность к оплате стажировки: ${user.ready_pay_intern}\n
                Вакансия: ${user.vacancy}\n
                Chat ID: ${user.chat_id}\n
                Username: @${username}\n${userId}`);
                bot.sendMessage(chatId, 'Спасибо за заполнение анкеты!');
                menu(msg, bot);
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                axios.post('http://qosyl.me:3000/api/save-data-company/', user, config)
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
}

module.exports = company_register;