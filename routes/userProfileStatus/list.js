// Models
const { ActivityType } = require("../../db").models;
const Sequelize = require("sequelize");
async function list(req, res) {
  const userRole = req.user.role;
  const userStatus = 1;
  const where = [];

  where.push(`FIND_IN_SET(${userRole}, user_roles)`);
  where.push(`FIND_IN_SET(${userStatus}, show_in_user_status)`);

  try {
    const userProfileStatus = await ActivityType.findAll({
      attributes: ["id", "name", "show_in_user_status"],
      where: Sequelize.where(Sequelize.literal(where.join(" AND "))),
      order: [
        ["sort", "ASC"],
        ["name", "ASC"],
      ],
    });
    const profileStatusData = [];
    userProfileStatus.forEach((profileStatus) => {
      profileStatusData.push({
        id: profileStatus.id,
        name: profileStatus.name,
      });
    });

    res.json(profileStatusData);
  } catch (error) {
    console.log( error);
  }
}

module.exports = list;
