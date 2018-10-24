const fs = require('fs');
module.exports = function (filePath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, {encoding: encoding || 'utf8'}, (err, data) => {
      if (err) reject(err);
      const links = data.replace('\r\n', '\n').split('\n').filter(link => link);
      resolve(links);
    });
  });
};
