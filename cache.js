const NodeCache = require('node-cache');
const imageCache = new NodeCache({ stdTTL: 600 }); // Cache expires in 10 minutes

module.exports = imageCache;