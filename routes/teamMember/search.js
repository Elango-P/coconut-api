const TeamMemberService = require('../../services/TeamMemberService');

const search = async (req, res, next) => {
  await TeamMemberService.search(req, res, next);
};

module.exports = search;
