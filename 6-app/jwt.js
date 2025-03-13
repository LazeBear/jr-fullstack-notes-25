const jwt = require('jsonwebtoken');

const secret = 'secret';

const payload = {
  id: 123,
};

const token = jwt.sign(payload, secret, {
  expiresIn: '1d',
});

const pl = jwt.verify('tken', secret);
console.log(pl);
console.log(token);
