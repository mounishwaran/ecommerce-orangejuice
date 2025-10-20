import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').isString().notEmpty().withMessage('This field is required.'),
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('address').optional().isString(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').isString().notEmpty().withMessage('This field is required.'),
  ],
  validate,
  login
);

export default router;
