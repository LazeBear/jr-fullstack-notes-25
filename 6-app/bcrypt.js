const bcrypt = require('bcryptjs');

const password = '123';

// const salt = bcrypt.genSaltSync();
// console.log(salt);

const salt = '$2b$10$yChk7UCAa5ioE3ZHcZhmiu';
const hashed = bcrypt.hashSync(password, salt);

console.log(hashed);
// $2b$10$4NkRDgH6KT3BM3cFUl1YkegSUXHtXW.H6Q7yR4qsxJdIn4c5ELxHS
// $2b$10$olbBR3fKxKhKmseIY9CRxeQW7b2lKMP9vunJF0ZzYPgsTo/Aa5AKW

// $2b$10$yChk7UCAa5ioE3ZHcZhmiu
// $2b$10$yChk7UCAa5ioE3ZHcZhmiu BBYufIVF0vNUEwoYKhC.wU3Sv4wB.ki
// $2b$10$yChk7UCAa5ioE3ZHcZhmiu BBYufIVF0vNUEwoYKhC.wU3Sv4wB.ki
