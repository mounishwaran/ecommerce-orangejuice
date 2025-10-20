import express from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { protect } from '../middleware/auth.js'
import { validateCoupon } from '../controllers/couponController.js'

const router = express.Router()

router.post(
  '/validate',
  protect,
  [
    body('code').isString().notEmpty(),
    body('items').isArray(),
    body('subtotal').optional().isNumeric()
  ],
  validate,
  validateCoupon
)

export default router
