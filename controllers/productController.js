const Product = require('../models/Product');

//@desc   Create a new product
//@route  POST /api/products
//@access Private (Admin/Cashier)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, barcode, imageUrl, costPrice } = req.body;

        if (!name || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name, category and price are required',
                data: null,
            });
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a valid non-negative number',
                data: null,
            });
        }

        if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Stock must be a non-negative whole number',
                data: null,
            });
        }

        const product = await Product.create({
            name,
            description: description || '',
            category,
            price: Number(price),
            costPrice: costPrice !== undefined ? Number(costPrice) : 0,
            stock: stock !== undefined ? Number(stock) : 0,
            barcode: barcode || '',
            imageUrl: imageUrl || '',
        });

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        console.error('Create product error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to create product',
            data: null,
        });
    }
};

// @desc Get all products
// @route GET /api/products
// @access Private (Admin/Cashier)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};


// @desc Search products by name, barcode or category
// @route GET /api/products/search
// @access Private (Admin/Cashier)
const searchProducts = async (req, res) => {
    try {
        const { name, barcode, category } = req.query;

        const filter = {};

        if (name) {
            filter.name = {
                $regex: name,
                $options: 'i'
            };
        }

        if (barcode) {
            filter.barcode = barcode;
        }

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter);

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};


// @desc Update a product
// @route PUT /api/products/:id
// @access Private (Admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};


// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};


// Export product controllers
module.exports = {
    createProduct,
    getProducts,
    searchProducts,
    updateProduct,
    deleteProduct
};