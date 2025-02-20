// // package -> built-in package
const fs = require('node:fs');
const path = require('path');

fs.readFile(
  path.join(__dirname, 'note.txt'),
  { encoding: 'utf-8' },
  (error, data) => {
    if (error) {
      console.log('error', error);
      return;
    }
    console.log(data);
  }
);

fs.writeFileSync(path.join(__dirname, 'test.txt'), 'hello from node fs');
