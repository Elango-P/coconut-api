const errors = require("restify-errors");
const { UserPreference } = require("../../db").models;

function save(req, res, next) {
  const data = req.body;

  const key = data.key;
  if (!key) {
    return next(new errors.BadRequestError("Key is required"));
  }

  const user_id = req.user.id;

  UserPreference.findOne({
    attributes: ["id"],
    where: { key, user_id },
  }).then((userPreference) => {
    const value = data.value;
    if (userPreference) {
      return userPreference.update({ value }).then(() => {
        res.json({ message: "User preference saved" });
      });
    }

    UserPreference.create({ key, user_id, value }).then(() => {
      res.json({ message: "User preference saved" });
    });
  });
}

module.exports = save;
