const express = require('express');
const app = express();
const port = 8020;

app.use(express.json());

const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
app.use('/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});