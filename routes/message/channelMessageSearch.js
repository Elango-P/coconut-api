const ChannelMessageService = require("../../services/ChannelMessageService");

const search = async (req, res, next) => {
  await ChannelMessageService.search(req, res, next);
};

module.exports = search;
