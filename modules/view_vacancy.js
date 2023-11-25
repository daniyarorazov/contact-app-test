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
                return `🏢 <b>Название компании:</b> ${vacancy.company_name.trim() || 'Не указано'} \n\n ` +
                `🚀 <b>Вакансия:</b> ${vacancy.job_title.trim() || 'Не указано'} \n ` +
                `📄 <b>Описание вакансии:</b> ${vacancy.description.trim() || 'Не указано'} \n ` +
                `⚡ <b>Навыки необходимы:</b> ${vacancy.skills_required.trim() || 'Не указано'} \n\n ` +
                `🕒 <b>Вид занятости:</b> ${vacancy.employment_type.trim() || 'Не указано'} \n ` +
                `📍 <b>Локация вакансии:</b> ${vacancy.location.trim() || 'Не указано'} \n\n ` +
                `💵 <b>Зарплата:</b> ${vacancy.salary.trim() || 'Не указано'} \n ` +
                `📅 <b>Крайний срок подачи заявок:</b> ${vacancy.application_deadline.trim() || 'Не указано'} \n\n ` +
                `✉️ <b>Контактная почта:</b> ${vacancy.contact_email.trim() || 'Не указано'} \n ` +
                `📞 <b>Контактный телефон:</b> ${vacancy.contact_phone.trim() || 'Не указано'} \n\n ` +
                `---------------------`;
            }).join('\n');

            if (message) {
                bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
            } else {
                bot.sendMessage(chatId, "Вакансий к сожалению не было найдено!");
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при получении данных');
        });
}

module.exports = view_vacancy;