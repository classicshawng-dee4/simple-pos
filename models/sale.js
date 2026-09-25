const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        barcode: {
          type: String,
          default: ''
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0
        },
        costPrice: {
          type: Number,
          default: 0,
          min: 0
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0
    },

    tax: {
      type: Number,
      default: 0,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'mobile_money'],
      required: true
    },

    amountPaid: {
      type: Number,
      required: true,
      min: 0
    },

    changeDue: {
      type: Number,
      default: 0,
      min: 0
    },

    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    cashierName: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['completed', 'voided', 'refunded'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sale', saleSchema);