const { validateToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const authorization = req.header('Authorization');
  if (!authorization) {
    res.status(401).json({ error: 'missing authorzation token' });
    return;
  }

  // Bearer xxxxxx
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer' || !token) {
    res.status(401).json({ error: 'invalid token' });
    return;
  }

  const payload = validateToken(token);
  if (!payload) {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  req.user = payload;
  next();
};
