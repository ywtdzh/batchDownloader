const readList = require('./readList');
const downloadToDir = require('./downloadToDir');

const params = {
  source: process.argv[2] || './source',
  dir: process.argv[3] || '.',
  prefix: process.argv[4] || '',
  suffix: process.argv[5] || '.jpg',
};

readList(params.source, 'utf8')
  .then(list => {
    return downloadToDir(params.dir, list, params.prefix, params.suffix);
  })
  .then(() => console.log('finish task'))
  .catch(console.log);