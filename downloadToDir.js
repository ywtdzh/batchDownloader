const fs = require('fs');
const axios = require('axios');
const EventEmitter = require('events');

module.exports = function (dirPath, urlList, prefix, suffix) {
  return new Promise((resolve, reject) => {
    fs.stat(dirPath, function (err, stats) {
      if (err && err.toString().includes('no such file or directory')) {
        fs.mkdir(dirPath, {recursive: true}, function (err) {
          if (err) reject(err);
          else resolve(true);
        });
      } else if (err) {
        reject(err);
      } else if (!stats.isDirectory()) {
        reject(new Error('The path is not a directory'));
      } else {
        resolve(true);
      }
    });
  }).then(function () {
    return new Promise((resolve, reject) => {
      const queue = urlList.map((url, index) => ({url, name: index.toString().padStart(4, '0')}));
      const event = new EventEmitter();
      let processing = 0;
      event.addListener('finish', () => {
        if (queue.length === 0 && processing === 0) resolve(true);
        const group = queue.splice(0, 20 - processing);
        processing += group.length;
        group.forEach(item => {
          axios.get(item.url, {responseType: 'arraybuffer'})
            .then(({data}) => {
              fs.writeFile(`${dirPath}/${prefix}${item.name}${suffix}`, data, () => {
                processing--;
                event.emit('finish');
              });
            });
        });
      });
      event.emit('finish')
    });
  });
};