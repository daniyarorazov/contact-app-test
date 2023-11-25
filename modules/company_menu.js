function company_menu(msg, bot) {
    const chatId = msg.chat.id;
    // Создаем клавиатуру с двумя кнопками
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['📝 Посмотреть свою анкету компании', '📝 Создать вакансию'],
                ['📝 Посмотреть анкеты студентов', '📝 Посмотреть свои вакансии'],
                ['🛑 Подать жалобу на студента'],
            ],
            resize_keyboard: true, // Изменение размера клавиатуры
        },
    };

    bot.sendMessage(chatId, 'Привет студент', keyboard);

}

module.exports = company_menu;