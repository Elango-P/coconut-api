const ChannelMessageService = require("../../services/ChannelMessageService");

const create = async (req, res, next) => {
  await ChannelMessageService.create(req, res, next);
};

module.exports = create;
