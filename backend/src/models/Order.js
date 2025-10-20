import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    itemName: { type: String, required: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    contact: {
      name: { type: String },
      address: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    payment: {
      method: { type: String, enum: ['COD', 'Card', 'UPI'], default: 'COD' },
      cardLast4: { type: String },
      cardBrand: { type: String },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'],
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
