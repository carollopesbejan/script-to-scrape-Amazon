const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = 3000;

app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        // Fazer a requisição à página de resultados de busca da Amazon
        const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        // Parsear o HTML usando JSDOM
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Extrair os dados dos produtos
        const products = [];
        const items = document.querySelectorAll('.s-main-slot .s-result-item');
        items.forEach(item => {
            const title = item.querySelector('h2 .a-link-normal')?.textContent.trim();
            const rating = item.querySelector('.a-icon-alt')?.textContent.trim().split(' ')[0];
            const reviews = item.querySelector('.s-link-style .a-size-small')?.textContent.trim();
            const imageUrl = item.querySelector('.s-image')?.getAttribute('src');

            if (title && rating && reviews && imageUrl) {
                products.push({ title, rating, reviews, imageUrl });
            }
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error scraping data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
