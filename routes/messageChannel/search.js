const MessageChannelService = require('../../services/MessageChannelService');

const search = async (req, res, next) => {
  await MessageChannelService.search(req, res, next);
};

module.exports = search;
