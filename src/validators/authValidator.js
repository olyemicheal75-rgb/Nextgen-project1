const { body, validationResult } = require('express-validator');

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const registerRules = () => [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .custom((email) => {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
];

const loginRules = () => [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .custom((email) => {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const passwordResetRules = () => [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerRules,
  loginRules,
  passwordResetRules,
  handleValidationErrors,
};
