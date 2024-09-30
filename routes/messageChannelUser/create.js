const MessageChannelUserService = require('../../services/MessageChannelUserService');

const create = async (req, res, next) => {
  await MessageChannelUserService.create(req, res, next);
};

module.exports = create;
