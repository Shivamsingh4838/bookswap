module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bookswap',
  JWT_SECRET: process.env.JWT_SECRET || 'poiuytresdfghjkmnbvcx456789jhgfv',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
