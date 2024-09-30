const MessageChannelService = require('../../services/MessageChannelService');

const create = async (req, res, next) => {
  await MessageChannelService.create(req, res, next);
};

module.exports = create;
