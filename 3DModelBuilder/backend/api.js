// backend/api.js - Vercel serverless entry point
const app = require('./server');
module.exports = (req, res) => app(req, res);
