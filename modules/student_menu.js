function student_menu(msg, bot) {
    const chatId = msg.chat.id;
    // Создаем клавиатуру с двумя кнопками
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['📝 Посмотреть свою анкету'],
                ['📝 Посмотреть вакансии']
            ],
            resize_keyboard: true, // Изменение размера клавиатуры
        },
    };

    bot.sendMessage(chatId, 'Привет студент', keyboard);

}

module.exports = student_menu;