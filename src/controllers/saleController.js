const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

const createSale = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      items,
      paymentMethod,
      amountPaid,
      discount = 0,
      tax = 0,
      cashierId,
      cashierName = ''
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Add at least one product to the sale.'
      });
    }

    if (!['cash', 'card', 'transfer', 'mobile_money'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method.'
      });
    }

    if (!Number.isFinite(amountPaid) || amountPaid < 0) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid amount paid.'
      });
    }

    if (!Number.isFinite(discount) || discount < 0 ||
        !Number.isFinite(tax) || tax < 0) {
      return res.status(400).json({
        success: false,
        message: 'Discount and tax must be valid non-negative numbers.'
      });
    }

    let receipt;

    await session.withTransaction(async () => {
      const saleItems = [];
      let subtotal = 0;

      for (const item of items) {
        const { productId, quantity } = item;

        if (!mongoose.isValidObjectId(productId)) {
          throw new Error('Invalid product ID.');
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error('Product quantity must be a positive whole number.');
        }

        const product = await Product.findById(productId).session(session);

        if (!product || product.isActive === false) {
          throw new Error('Product not found or inactive.');
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for ${product.name}.`);
        }

        const unitPrice = product.price;
        const costPrice = product.costPrice || 0;
        const itemSubtotal = unitPrice * quantity;

        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: productId,
            stock: { $gte: quantity }
          },
          {
            $inc: { stock: -quantity }
          },
          {
            new: true,
            session
          }
        );

        if (!updatedProduct) {
          throw new Error(`Insufficient stock for ${product.name}.`);
        }

        saleItems.push({
          product: product._id,
          name: product.name,
          barcode: product.barcode || '',
          quantity,
          unitPrice,
          costPrice,
          subtotal: itemSubtotal
        });

        subtotal += itemSubtotal;
      }

      const total = subtotal - discount + tax;

      if (total < 0) {
        throw new Error('Discount cannot make the total negative.');
      }

      if (amountPaid < total) {
        throw new Error('Amount paid is less than the sale total.');
      }

      const changeDue = amountPaid - total;

      const receiptNumber =
        `POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const createdSales = await Sale.create(
        [{
          receiptNumber,
          items: saleItems,
          subtotal,
          discount,
          tax,
          total,
          paymentMethod,
          amountPaid,
          changeDue,
          cashierId: cashierId || null,
          cashierName,
          status: 'completed'
        }],
        { session }
      );

      receipt = createdSales[0];
    });

    return res.status(201).json({
      success: true,
      message: 'Sale completed successfully.',
      data: receipt
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  } finally {
    await session.endSession();
  }
};
const getSales = async (req, res) => {
try {
const sales = await Sale.find().sort({ createdAt: -1 });

res.status(200).json({
success: true,
count: sales.length,
data: sales
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message
});
}


};
module.exports = {
createSale,
getSales
};
