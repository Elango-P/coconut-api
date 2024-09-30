const TeamMemberService = require('../../services/TeamMemberService');

const del = async (req, res, next) => {
  await TeamMemberService.delete(req, res, next);
};

module.exports = del;
