// module

// ES module
// import export

// Node.js -> CommonJs module
// require  module.exports/export.xxxx

// const module = {};

// IIFE
// Immediately invoked function expression
// (function (module) {
//   let count = 0;
//   const increment = () => count++;
//   const getCount = () => count;
//   module.increment = increment;
//   module.getCount = getCount;
// })(module);

// module.increment();
// module.increment();
// module.increment();
// module.increment();
// console.log(module.getCount());
// count--;

const { getCount, increment } = require('./counter');

increment();
increment();
increment();
increment();
increment();

console.log(getCount());
