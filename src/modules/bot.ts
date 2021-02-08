const Telebot = require('telebot');
import { Chat } from '../database/Chat';

require('dotenv').config();

export const bot = new Telebot(process.env.BOT_TOKEN);
export const chatId = process.env.CHAT_ID;

bot.on(['/start'], async (msg) => {
    const chatId = msg.chat.id;
    if (await Chat.query().findById(chatId)) {
        msg.reply.text('This chat is already marked!')
        return;
    }
    await Chat.query().insert({ chatId });
    msg.reply.text('This chat has been marked successfully!');
})

bot.on(['/cancel'], async (msg) => {
    const chatId = msg.chat.id;
    if (!await Chat.query().findById(chatId)) {
        msg.reply.text('This chat is not marked!');
        return;
    }
    await Chat.query().deleteById(chatId);
    msg.reply.text('This chat has been removed successfully!');
})

bot.start();


