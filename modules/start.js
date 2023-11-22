function start(msg, bot) {
    const chatId = msg.chat.id;
    // Создаем клавиатуру с двумя кнопками
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['🎓 Я студент'],
                ['🚀 Я работодатель (компания)']
            ],
            one_time_keyboard: true, // Одноразовая клавиатура
            resize_keyboard: true, // Изменение размера клавиатуры
        },
    };

    bot.sendMessage(chatId, 'Привет! Рад, что ты зашел к нам, в Мансап телеграм бота. Прежде чем начать и сделать регистрацию, скажи кем являешься:', keyboard);
}

module.exports = start;