const errors = require("restify-errors");

// User Permission Create
const createUserPermission = require("./createUserPermission");

function create(req, res, next) {
  const data = req.body;
  const ids = data.ids;
  const userId = data.userId;

  if (!ids) {
    return next(new errors.BadRequestError("User Permission Is Required"));
  }

  // User Permission Create
  createUserPermission(ids, userId, req.user.id, () => {
    // Return Success Message
    res.json({ message: "User Permission Updated" });
  });
}

module.exports = create;
