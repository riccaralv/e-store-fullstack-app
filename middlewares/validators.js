import { body, validationResult } from 'express-validator';

export const rules = [
  body('email')
    .isEmail()
    .withMessage('Please provide us with a valid email')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password should be a string')
    .isLength({ min: 4 })
    .withMessage('Please the password is too short'),
  // lo siguiente nos ayuda a tratar los errores que se hayan detectado en la validation --> CUSTOM MIDDLEWARE
  // extracting errors from req object --> si se detecta algún fallo durante la validation, esto creará un error dentro del objeto 'req'
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.json({
        success: false,
        message: errors.array().map((err) => ({ [err.param]: err.msg })),
      });
    }
  },
];
