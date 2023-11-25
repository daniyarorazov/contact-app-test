const menu = require("./company_menu");
const axios = require("axios");
const pgp = require('pg-promise')();
const db = pgp({
    connectionString: 'postgresql://postgres:123123@127.0.0.1/mansap_telegram_database'
});
function create_vacancy(msg, bot) {
    const chatId = msg.chat.id;
    const jobTitle = [];
    bot.sendMessage(chatId, "Создание вакансии");

    db.oneOrNone('SELECT * FROM company WHERE chat_id = $1::varchar', chatId)
        .then(user => {
                if (user) {
                    jobTitle.push(user.name_company);
                }
        });


    let user = {};
    let timeDateStep = {step: 1};
    const userId = msg.from.id;
    user.company_id = chatId;
    user.company_name = "dasds";
    bot.sendMessage(chatId, 'Шаг 1 из 9: Название вакансии').then(r => console.log(r));

    // Обработчик события 'text' для всего процесса анкеты
    function handleUserInput(msg) {
        switch (timeDateStep.step) {
            case 1:
                user.job_title = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 2 из 9: Описание вакансии').then(r => console.log(r));
                break;

            case 2:
                user.description = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 3 из 9: Какие навыки необходимы?');
                break;

            case 3:
                user.skills_required = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 4 из 9: Какой вид занятости?');
                break;

            case 4:
                user.employment_type = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 5 из 9: Локация вакансии?');
                break;

            case 5:
                user.location = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 6 из 9: Будет ли зарплата? Если да, то напишите сумму, если нет, то напишите "Нет"');
                break;

            case 6:
                user.salary = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 7 из 9: Какой крайний срок подачи заявок? (дд.мм.гггг)');
                break;
            case 7:
                user.application_deadline = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 8 из 9: Контактная почта для связи? (в формате example@gmail.com)');
                break;
            case 8:
                user.contact_email = msg.text;
                timeDateStep.step++;
                bot.sendMessage(chatId, 'Шаг 9 из 9: Контактный телефон для связи? (в формате +7 777 777 77 77)');
                break;

            case 9:
                user.contact_phone = msg.text;
                const username = msg.from.username;
                bot.sendMessage(chatId, `<b>Ваша новая вакансия:</b>\n\n` +
                `Вакансия: ${user.job_title.trim() || 'Не указано'}\n` +
                `Описание вакансии: ${user.description.trim() || 'Не указано'}\n` +
                `Навыки необходимы: ${user.skills_required.trim() || 'Не указано'}\n` +
                `Вид занятости: ${user.employment_type.trim() || 'Не указано'}\n` +
                `Локация вакансии: ${user.location.trim() || 'Не указано'}\n` +
                `Будет ли зарплата: ${user.salary.trim() || 'Не указано'}\n` +
                `Крайний срок подачи заявок: ${user.application_deadline.trim() || 'Не указано'}\n` +
                `Контактная почта для связи: ${user.contact_email.trim() || 'Не указано'}\n` +
                `Контактный телефон для связи: ${user.contact_phone.trim() || 'Не указано'}`
                , { parse_mode: 'HTML' });
            
                bot.sendMessage(chatId, 'Спасибо за заполнение анкеты!');
                menu(msg, bot);
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                axios.post('http://qosyl.me:3000/api/save-data-vacancy/', user, config)
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.log(error);
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

module.exports = create_vacancy;