import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, contact = {}, payment = {} } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items in order' });

    // Contact snapshot (fallback to user profile if missing)
    const uProfile = await User.findById(req.user.id).select('name email address phone')
    const name = ((contact.name || uProfile?.name || '')).trim()
    const address = ((contact.address || uProfile?.address || '')).trim()
    const phone = ((contact.phone || uProfile?.phone || '')).trim()
    const email = ((contact.email || uProfile?.email || '')).trim()

    // Basic server-side validation to mirror frontend
    if (name && (!/^[A-Za-z ]{3,}$/.test(name))) return res.status(400).json({ message: 'Invalid name format' })
    if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))) return res.status(400).json({ message: 'Invalid email format' })
    if (phone) {
      const normalized = phone.replace(/[^0-9]/g,'')
      const ten = normalized.startsWith('91') ? normalized.slice(-10) : normalized
      if (!/^[6-9][0-9]{9}$/.test(ten)) return res.status(400).json({ message: 'Invalid phone number format' })
    }

    // Attach product names for better summaries
    const productIds = items.map(i => i.productId)
    const products = await Product.find({ _id: { $in: productIds } }).select('_id name')
    const nameMap = new Map(products.map(p => [String(p._id), p.name]))
    const itemsWithNames = items.map(i => ({ ...i, itemName: nameMap.get(String(i.productId)) || undefined }))

    // Mask payment summary
    let paymentSummary = {}
    if (payment && payment.method) {
      paymentSummary.method = payment.method
      if (payment.method === 'Card') {
        const num = String(payment.cardNumber || '').replace(/\s+/g,'')
        const last4 = num.slice(-4)
        const brand = (/^4/.test(num) ? 'VISA' : (/^5[1-5]/.test(num) ? 'MASTERCARD' : undefined))
        paymentSummary.cardLast4 = last4 || undefined
        paymentSummary.cardBrand = brand
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      items: itemsWithNames,
      totalAmount,
      contact: { name, address, phone, email },
      payment: paymentSummary,
      status: 'Pending'
    })
    // persist phone to user profile if missing to improve admin fallbacks
    if (phone && (!uProfile?.phone)) {
      try {
        uProfile.phone = phone
        await uProfile.save()
      } catch (e) {
        console.error('Unable to persist user phone', e)
      }
    }
    res.status(201).json(order)
  } catch (err) {
    console.error('Order create failed', err)
    res.status(500).json({ message: 'Could not place order' })
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone address'); // 👈 This is the fix

    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
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
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 })
      .populate({ path: 'userId', select: 'name email address phone' })
      .populate({ path: 'items.productId', select: 'name' })
      .lean();

    // Build fallback maps if populate didn't resolve
    const userIds = Array.from(new Set(orders.map(o => String(o.userId && o.userId._id ? o.userId._id : o.userId))))
      .filter(Boolean)
    const productIds = Array.from(new Set(orders.flatMap(o => (o.items||[]).map(it => String(it.productId && it.productId._id ? it.productId._id : it.productId)))))
      .filter(Boolean)

    const [users, products] = await Promise.all([
      userIds.length ? User.find({ _id: { $in: userIds } }).select('_id name email address phone').lean() : Promise.resolve([]),
      productIds.length ? Product.find({ _id: { $in: productIds } }).select('_id name').lean() : Promise.resolve([]),
    ])
    const userMap = new Map(users.map(u => [String(u._id), u]))
    const productMap = new Map(products.map(p => [String(p._id), p]))

    const normalized = orders.map(o => {
      const userObj = (o.userId && typeof o.userId === 'object') ? o.userId : (userMap.get(String(o.userId)) || {})
      const contact = o.contact || {}
      const mergedContact = {
        name: contact.name || userObj.name || '',
        email: contact.email || userObj.email || '',
        phone: contact.phone || userObj.phone || '',
        address: contact.address || userObj.address || ''
      }
      const items = (o.items||[]).map(it => {
        const pObj = (it.productId && typeof it.productId === 'object') ? it.productId : productMap.get(String(it.productId))
        return { ...it, itemName: it.itemName || pObj?.name }
      })
      return {
        ...o,
        contact: mergedContact,
        userName: mergedContact.name,
        userEmail: mergedContact.email,
        userPhone: mergedContact.phone,
        userAddress: mergedContact.address,
        items
      }
    })
    res.json(normalized)
  } catch (e) {
    console.error('getAllOrders failed', e)
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  await order.deleteOne();
  res.json({ message: 'Order deleted' });
};
