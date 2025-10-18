import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    imageURL: { type: String, default: '' },
    modelURL: { type: String, default: '' },
    size: { type: String, enum: ['250ml', '500ml', '1L'], default: '500ml' },
    type: { type: String, enum: ['Classic', 'Pulpy', 'No Sugar', 'With Mint'], default: 'Classic' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
