const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = './products.json';

router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(path, 'utf8');
        let products = JSON.parse(data);
        const limit = parseInt(req.query.limit, 10);

        if (limit) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error reading the products file' });
    }
});

module.exports = router;