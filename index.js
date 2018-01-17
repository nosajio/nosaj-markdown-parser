const helpers = require('./helpers');

const exportable = Object.assign({}, helpers, {
  fileOpener:     require('./file-opener'),
  markdownParser: require('./markdown-parser'),
});

module.exports = Object.freeze( exportable );
