import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('address').optional().isString(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isString().notEmpty()],
  validate,
  login
);

export default router;
