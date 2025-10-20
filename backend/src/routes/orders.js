import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, getUserOrders, updateOrderStatus, getAllOrders, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

// User routes
router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isMongoId(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('totalAmount').isFloat({ min: 0 }),
    body('contact').optional().isObject(),
    body('contact.name').optional().custom((v)=> typeof v === 'string' && (/^[A-Za-z ]{3,}$/.test(v.trim()))),
    body('contact.email').optional().custom((v)=> /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)),
    body('contact.phone').optional().custom((v)=> {
      const n = String(v).replace(/[^0-9]/g,'')
      const ten = n.startsWith('91') ? n.slice(-10) : n
      return /^[6-9][0-9]{9}$/.test(ten)
    }),
    body('payment').optional().isObject(),
    body('payment.method').optional().isIn(['COD','Card','UPI']),
    body('payment.cardNumber').optional().isLength({ min: 12, max: 19 }),
  ],
  validate,
  createOrder
);

router.get('/', protect, getUserOrders);

// Admin routes
router.get('/all', protect, adminOnly, getAllOrders);

router.put(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId(), body('status').isString().notEmpty()],
  validate,
  updateOrderStatus
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId()],
  validate,
  deleteOrder
);

export default router;
