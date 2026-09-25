const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
    res.send('POS API is running!');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected successfully!');

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 });
}).catch((error) => {
    console.error('MongoDB connection failed:', error.message);
});
