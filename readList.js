const fs = require('fs');
module.exports = function (filePath, encoding) {
  return new Promise(resolve => {
    fs.readFile(filePath, {encoding: encoding || 'utf8'}, (err, data) => {
      if (err) return;
      const links = data.replace('\r\n', '\n').split('\n').filter(link => link);
      resolve(links);
    });
  });
};
