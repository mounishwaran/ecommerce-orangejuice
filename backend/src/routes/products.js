import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);

router.post(
  '/',
  protect,
  adminOnly,
  [body('name').isString().notEmpty(), body('price').isFloat({ min: 0 })],
  validate,
  createProduct
);

router.put(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId()],
  validate,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId()],
  validate,
  deleteProduct
);

export default router;
