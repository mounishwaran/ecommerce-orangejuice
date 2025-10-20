import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mapped = errors.array().map(e => ({ field: e.path, message: e.msg }));
    return res.status(400).json({ message: 'Validation failed', errors: mapped });
  }
  next();
};
