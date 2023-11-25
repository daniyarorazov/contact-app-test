const axios = require('axios');
function view_own_company(msg, bot) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Ваша анкета компании:');

    axios.get(`http://qosyl.me:3000/company/${chatId}`)
        .then(response => {
            const company = response.data;
            if (company) {
                const message = `🏢 <b>Название компании:</b> ${company.name_company.trim() || 'Не указано'} \n\n ` +
                `🚀 <b>Тип компании:</b> ${company.type_company.trim() || 'Не указано'} \n ` +
                `📄 <b>Веб-сайт компании:</b> ${company.website_company.trim() || 'Не указано'} \n ` +
                `⚡ <b>Имя-Фамилия-Роль сотрудника:</b> ${company.name_surname_role_person.trim() || 'Не указано'} \n\n ` +
                `🕒 <b>Готовность к оплате стажировки:</b> ${company.ready_pay_intern || 'Не указано'} \n ` +
                `---------------------`;
                bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
            } else {
                bot.sendMessage(chatId, "Анкета компании не была найдена!");
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при получении данных');
        });

}

module.exports = view_own_company;