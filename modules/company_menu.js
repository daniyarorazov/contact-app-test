function company_menu(msg, bot) {
    const chatId = msg.chat.id;
    // Создаем клавиатуру с двумя кнопками
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['📝 Посмотреть свою анкету компании'],
                ['📝 Посмотреть анкеты студентов']
            ],
            resize_keyboard: true, // Изменение размера клавиатуры
        },
    };

    bot.sendMessage(chatId, 'Привет студент', keyboard);

}

module.exports = company_menu;