const express = require('express');
const router = express.Router();

const {
    createProduct,
    getProducts,
    searchProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Create product
router.post('/', createProduct);

// Search products
router.get('/search', searchProducts);

// Get all products
router.get('/', getProducts);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

module.exports = router;