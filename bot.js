const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// استبدل هذا بالرمز الخاص بالبوت الخاص بك
const token = '7258038220:AAEpKmUpwpLbz4MIoxFlOru2QcETLL9c68k';

// إنشاء البوت
const bot = new TelegramBot(token, { polling: true });

// التعامل مع أوامر البوت
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! Send me a product name to search on AliExpress.");
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const searchQuery = msg.text;
    const apiUrl = `https://your-render-url.com/api/products?search=${encodeURIComponent(searchQuery)}`;

    try {
        const response = await axios.get(apiUrl);
        const products = response.data;

        if (products.length > 0) {
            products.slice(0, 5).forEach(product => {
                bot.sendMessage(chatId, `*Title:* ${product.title}\n*Price:* ${product.price}\n[Link](${product.link})`, { parse_mode: 'Markdown' });
            });
        } else {
            bot.sendMessage(chatId, 'No products found.');
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Error fetching products.');
    }
});

console.log('Bot is running...');
