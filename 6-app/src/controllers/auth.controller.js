// authentication, authorization

const ConflictsException = require('../exceptions/conflict.exception');
const UnauthorizedException = require('../exceptions/unauthorized.exception');
const UserModel = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const Joi = require('joi');

/**
 * 1. try catch -> async await
 * try {
 *    xxxx
 * } catch(e) {
 *    xxx
 *    next(e);
 * }
 *
 * 2. .catch -> promise.then.catch
 * UserModel.findOne().then().catch(e=> next(e))
 *
 * 3. callback
 * UserModel.findOne((err, user)=>{
 *    if (err) {
 *      next(err);
 *      return;
 *    }
 *    xxxx
 * })
 *
 * const catchAllErrors = (middleware) => {
 *  return async (req, res, next) => {
 *    try {
 *      await middleware(req,res, next);
 *    } catch(e) {
 *      next(e);
 *    }
 *  }
 * }
 *
 * app.get('/', register);
 * app.get('/', catchAllErrors(register));
 *
 * express-async-errors
 *
 * Joi - validation schema
 */

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (await UserModel.findOne({ username })) {
      next(new ConflictsException('Username already exists', { username }));
      return;

      // throw new Error("xxx");
      // res
      //   .status(409)
      //   .json({ success: false, error: 'User already exists' });
    }
    const user = new UserModel({ username, password });
    await user.hashPassword();
    await user.save();
    // throw new Error();
    // UserModel.findByIdAndUpdate({},{},{runValidators: true});

    const token = generateToken({ id: user.id, username: user.username });

    res.status(201).json({ success: true, data: { token } });
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      next(new UnauthorizedException('Invalid crendentials'));
      return;
    }
    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      // fail fast
      next(new UnauthorizedException('Invalid crendentials'));
      return;
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: 'admin',
    });

    res.json({ succes: true, data: { token } });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
};

// {
//   success: true/false,
//   data: {}/[],
//   error: {}/""
// }

// fetch, axios

// res.formatResponse = ()=>{}
