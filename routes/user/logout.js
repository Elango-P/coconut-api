const { User } = require("../../db").models;

function logout(req, res, next) {
  const user_id = req.user.id;
  User.findOne({
    attributes: ["id", "name", "session_id"],
    where: { id: user_id },
  }).then((user) => {
    user
      .update({ session_id: null, status: null })
      .then(() => {
        res.json({ message: "User LoggedOut" });
      })
      .catch((err) => {
        req.log.error(err);
        return next(err);
      });
  });
}

module.exports = logout;
