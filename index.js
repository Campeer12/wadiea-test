const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

// استبدل هذا بالرمز الخاص بالبوت الخاص بك
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// إنشاء البوت
const bot = new TelegramBot(token, { polling: true });

// وظيفة لجلب معلومات المنتجات من علي إكسبريس
const fetchProducts = async (searchQuery) => {
    const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(searchQuery)}`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let products = [];
        
        $('div._3t7zg').each((index, element) => {
            const product = {
                title: $(element).find('a._3t7zg').text().trim(),
                price: $(element).find('span._1vC4OE').text().trim(),
                link: $(element).find('a._3t7zg').attr('href'),
                image: $(element).find('img._3t7zg').attr('src')
            };
            products.push(product);
        });

        return products;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// التعامل مع أوامر البوت
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! Send me a product name to search on AliExpress.");
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const searchQuery = msg.text;

    const products = await fetchProducts(searchQuery);

    if (products.length > 0) {
        products.slice(0, 5).forEach(product => {
            bot.sendMessage(chatId, `*Title:* ${product.title}\n*Price:* ${product.price}\n[Link](${product.link})`, { parse_mode: 'Markdown' });
        });
    } else {
        bot.sendMessage(chatId, 'No products found.');
    }
});

console.log('Bot is running...');
