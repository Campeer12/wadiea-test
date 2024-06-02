const express = require('express');
const axios = require('axios');
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
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
