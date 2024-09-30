const errors = require("restify-errors");

// Models
const { UserProfileStatus, User } = require("../../db").models;

// Services

const userProfileStatusHistoryService = require("../../services/UserProfileStatusHistoryService");

function save(req, res, next) {
  const userProfileStatusId = req.params.id;

  if (userProfileStatusId === req.user.profile_status_id) {
    return res.json({ message: "User status updated" });
  }

  UserProfileStatus.findOne({
    attributes: ["id"],
    where: { id: userProfileStatusId },
  }).then((userProfileStatus) => {
    if (!userProfileStatus) {
      return next(new errors.NotFoundError("User status not found"));
    }

    const userId = req.user.id;

    const data = {
      user_id: userId,
      user_profile_status_id: userProfileStatusId,
    };

    User.update(
      {
        profile_status_id: userProfileStatusId,
      },
      {
        where: { id: userId },
      }
    ).then(() => {
      res.json({ message: "User status updated" });
      // res.on("finish", () => {
      //   dashboardIndexService.updateIndexDashboard(userId, () => {
      //     userProfileStatusHistoryService.create(data, () => {});
      //   });
      // });
    });
  });
}

module.exports = save;
