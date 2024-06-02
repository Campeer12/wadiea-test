const express = require('express');
const axios = require('axios');
<<<<<<< HEAD

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
=======
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/products', async (req, res) => {
    const searchQuery = req.query.search;
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

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products from AliExpress' });
>>>>>>> 300631df487814b1113083a54dc18aaf1817fc7f
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
