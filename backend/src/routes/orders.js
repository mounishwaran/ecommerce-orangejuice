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
