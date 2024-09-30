const verifyToken = require('../../middleware/verifyToken');
const report = require('./report');

module.exports = (server) => {
  server.get('/v1/replenishmentAllocation/report', verifyToken, report);
};
