import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { submitContact, listContacts } from '../controllers/contactController.js';

const router = express.Router();

router.post(
  '/',
  [body('name').isString().notEmpty(), body('email').isEmail(), body('message').isString().notEmpty()],
  validate,
  submitContact
);

router.get('/', protect, adminOnly, listContacts);

export default router;
