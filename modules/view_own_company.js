function view_own_company(msg, bot) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Ваша анкета компании:');


}

module.exports = view_own_company;