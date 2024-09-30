const TeamMemberService = require('../../services/TeamMemberService');

const create = async (req, res, next) => {
  await TeamMemberService.create(req, res, next);
};

module.exports = create;
