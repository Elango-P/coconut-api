const errors = require("restify-errors");

// Utils
const utils = require("../../lib/utils");

// Models
const { User } = require("../../db").models;

const History = require("../../services/HistoryService");

function loginByAdmin(req, res, next) {
  const data = req.body;

  const email = data.email;
  if (!email) {
    return next(new errors.BadRequestError("Email is required"));
  }

  User.findOne({
    attributes: [
      "id",
      "name",
      "password",
      "session_id",
      "role",
    ],
    where: { email: data.email, active: 1 },
  }).then((user) => {
    if (!user) {
      return next(
        new errors.UnauthorizedError(
          "Invalid Username or Password"
        )
      );
    }

    const session_id = user.session_id || Math.floor(Date.now());

    user
      .update({
        last_loggedin_at: utils.getSQlCurrentDateTime(),
        session_id,
      })
      .then(() => {

        let req = new Object();

        req.user = user;

        History.create("User LoggedIn SuccessFully", req);

        res.json({
          message: "User LoggedIn SuccessFully",
          user: {
            token: session_id,
            id: user.id,
            role: user.role,
            firstName: user.name,
            lastName: user.last_name,
          },
        });
      })
      .catch((err) => {
        req.log.error(err);
        return next(err);
      });
  });
}

module.exports = loginByAdmin;
