import Order from '../models/Order.js'

// Basic coupon validation logic based on user order history and cart
// Supported codes (case-insensitive):
// - FRESH20: 20% off, only if user has 0 past orders
// - BULK10: 10% off, if total quantity >= 10
// - REGULAR5: 5% off if user has >= 3 past orders
// - LOYAL5: 5% off if user has >= 5 past orders
// - LOYAL10: 10% off if user has >= 10 past orders
export const validateCoupon = async (req, res, next) => {
  try {
    const userId = req.user?._id
    const { code, items = [], subtotal } = req.body || {}

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ valid: false, message: 'Coupon code required.' })
    }

    // Silent ignore of subtotal here; you could enforce min order values if needed

    // Compute user orders count
    let ordersCount = 0
    if (userId) {
      ordersCount = await Order.countDocuments({ user: userId })
    }

    const quantityTotal = Array.isArray(items) ? items.reduce((s, i) => s + (Number(i.quantity) || 0), 0) : 0

    const c = code.trim().toLowerCase()
    let percent = 0

    if (c === 'fresh20' && ordersCount === 0) percent = 20
    else if (c === 'bulk10' && quantityTotal >= 10) percent = 10
    else if (c === 'loyal10' && ordersCount >= 10) percent = 10
    else if (c === 'loyal5' && ordersCount >= 5) percent = 5
    else if (c === 'regular5' && ordersCount >= 3) percent = 5

    if (!percent) {
      return res.json({ valid: false, message: 'Invalid or ineligible code.' })
    }

    return res.json({ valid: true, percent })
  } catch (err) {
    // Do not leak internal errors to user; forward to error handler
    return next(err)
  }
}
