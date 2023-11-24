const pgp = require('pg-promise')();
const db = pgp({
    connectionString: 'postgresql://postgres:123123@127.0.0.1/mansap_telegram_database'
});
function view_vacancy(msg, bot) {
    const chatId = msg.chat.id;

    // Send initial message
    bot.sendMessage(chatId, 'Вакансии компании: ');

    // Fetch data from the database
    db.any('SELECT * FROM vacancies WHERE company_id = $1::varchar', chatId)
        .then(data => {

            console.log(data)
            console.log(chatId)
            // Process the data and construct a message
            const message = data.map(vacancy => {
                return `
                    Название компании: ${vacancy.company_name || "Unknown"}
                    Вакансия: ${vacancy.job_title || "Unknown"}
                    Описание вакансии: ${vacancy.description || "Unknown"}
                    Навыки необходимы: ${vacancy.skills_required || "Unknown"}
                    Вид занятости: ${vacancy.employment_type || "Unknown"}
                    Локация вакансии: ${vacancy.location || "Unknown"}
                    Зарплата: ${vacancy.salary || "Unknown"}
                    Крайний срок подачи заявок: ${vacancy.application_deadline || "Unknown"}
                    Контактная почта для связи: ${vacancy.contact_email || "Unknown"}
                    Контактный телефон для связи: ${vacancy.contact_phone || "Unknown"}
                    ---------------------
                `;
            }).join('\n');

            // Send the constructed message
            // setTimeout(() => {
            //     bot.sendMessage(chatId, message);
            // }, 2000);
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при получении данных');
        });
}

module.exports = view_vacancy;