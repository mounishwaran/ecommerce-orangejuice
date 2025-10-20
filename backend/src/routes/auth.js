import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

const isAdminEmail = (req) => {
  const list = process.env.ADMIN_EMAILS?.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean) || []
  const email = (req.body?.email || '').toLowerCase()
  return list.includes(email)
}

router.post(
  '/register',
  [
    body('name').custom((val, { req }) => {
      if (isAdminEmail(req)) return true
      if (typeof val !== 'string') throw new Error('This field is required.')
      const trimmed = val.trim()
      if (trimmed.length < 3) throw new Error('Name must be at least 3 characters.')
      if (!/^[A-Za-z ]+$/.test(trimmed)) throw new Error('Name must contain only alphabets and spaces.')
      return true
    }),
    body('email').custom((val, { req }) => {
      if (isAdminEmail(req)) return true
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val || '')) throw new Error('Please enter a valid email.')
      return true
    }),
    body('password').custom((val, { req }) => {
      if (isAdminEmail(req)) return true
      if (typeof val !== 'string' || val.length < 8) throw new Error('Password must be at least 8 characters.')
      if (!/[A-Z]/.test(val) || !/[a-z]/.test(val) || !/[0-9]/.test(val) || !/[^A-Za-z0-9]/.test(val)) throw new Error('Password must include upper, lower, number and special char.')
      return true
    }),
    body('address').optional().isString(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').custom((val, { req }) => {
      if (isAdminEmail(req)) return true
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val || '')) throw new Error('Please enter a valid email.')
      return true
    }),
    body('password').isString().notEmpty().withMessage('This field is required.'),
  ],
  validate,
  login
);

export default router;
