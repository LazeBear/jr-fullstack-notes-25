const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // mongoose create unique index
    minLength: 2,
    maxLength: 20,
    validate: {
      validator: (username) => {
        // validation logic
        return /^[a-zA-Z0-9]+$/.test(username);
      },
      message: (props) => `${props.value} is not a valid username`,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

// user.hashPassword()
schema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 12);
};

schema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// User
// UserModel
const UserModel = model('User', schema);

module.exports = UserModel;

// module.exports = model(
//   'User',
//   new Schema({
//     username: {
//       type: String,
//       required: true,
//       unique: true, // mongoose create unique index
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   })
// );

// https
