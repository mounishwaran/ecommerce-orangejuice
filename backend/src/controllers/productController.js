import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const { q, size, type, minPrice, maxPrice } = req.query;
  const filter = { active: true };
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (size) filter.size = size;
  if (type) filter.type = type;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, price, description, imageURL, size, type, active } = req.body;
  const product = await Product.create({ name, price, description, imageURL, size, type, active });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
};
