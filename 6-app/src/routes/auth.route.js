const { Router } = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validation.middleware');
const authValidationSchema = require('../validations/auth.validation');

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authValidationSchema.register),
  register
);
authRouter.post('/login', validateBody(authValidationSchema.login), login);

module.exports = authRouter;
