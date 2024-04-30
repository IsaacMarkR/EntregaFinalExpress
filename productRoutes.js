const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = './products.json';

async function loadProducts() {
    try {
        const data = await fs.readFile(path, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Error reading the products file');
    }
}

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

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send('Missing required fields');
        }
        const products = await loadProducts();
        if (products.some(product => product.code === code)) {
            return res.status(409).send('Product with this code already exists');
        }

        const newProduct = {
            id: uuidv4(),
            title,
            description,
            code,
            price,
            status: true, 
            stock,
            category,
            thumbnails
        };
        products.push(newProduct);

        await fs.writeFile(path, JSON.stringify(products, null, 2), 'utf8');
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

module.exports = router;