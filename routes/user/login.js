const errors = require("restify-errors");
const utils = require("../../lib/utils");
const { User } = require("../../db").models;

function login(req, res, next) {
  const data = req.body;

  const email = data.email;
  
  User.findOne({
    attributes: [
      "id",
      "name",
      "last_name",
      "session_id",
      "company_id",
      "login_time",
      "role",
    ],
    where: { email, active: 1 },
  }).then((user) => {
    if (!user) {
      return next(
        new errors.UnauthorizedError(
          "This google account is not yet registered with us"
        )
      );
    }

    const userDetails = user.get();

    const session_id = userDetails.session_id || Math.floor(Date.now());
    const user_id = userDetails.id;

    user
      .update({
        last_loggedin_at: utils.getSQlCurrentDateTime(),
        session_id,
      })
      .then(() => {
        const response = {
          message: "User LoggedIn SuccessFully",
          user: {
            token: session_id,
            id: user_id,
            role: userDetails.role,
            firstName: userDetails.name,
            lastName: userDetails.last_name,
            companyId: userDetails.company_id,
          },
        };

        res.json(response);
      })
      .catch((err) => {
        req.log.error(err);
        return next(err);
      });
  });
}

module.exports = login;
