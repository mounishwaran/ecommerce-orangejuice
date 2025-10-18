import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  const { items, totalAmount } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'No items in order' });
  const order = await Order.create({ userId: req.user.id, items, totalAmount, status: 'Pending' });
  res.status(201).json(order);
};

export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  await order.save();
  res.json(order);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  await order.deleteOne();
  res.json({ message: 'Order deleted' });
};
