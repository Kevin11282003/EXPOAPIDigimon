const path = require('path');

module.exports = {
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'],
  },
  watchFolders: [
    path.resolve(__dirname, 'node_modules'),
  ],
};
