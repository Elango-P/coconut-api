const verifyToken = require('../../middleware/verifyToken');
const create = require('./create');
const search = require('./search');
const getdetail = require('./get');
const update = require('./update');
const del = require('./delete');
const updateStatus = require('./updateStatus');

module.exports = (server) => {
  server.post('/v1/recurringTask', verifyToken, create);
  server.get('/v1/recurringTask/:id', verifyToken, getdetail);
  server.get('/v1/recurringTask/search', verifyToken, search);
  server.put('/v1/recurringTask/:id', verifyToken, update);
  server.del('/v1/recurringTask/:id', verifyToken, del);
  server.put('/v1/recurringTask/status/:id', verifyToken, updateStatus);
};