let count = 0;
const increment = () => count++;
const getCount = () => count;

module.exports = {
  increment,
  getCount,
};

// exports.increment = increment;
// exports.getCount = getCount;

// X
// exports = {
//   increment,
//   getCount,
// }

// module.exports = exports
