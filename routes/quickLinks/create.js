const errors = require("restify-errors");

// Models
const { QuickLinks } = require("../../db").models;

function create(req, res, next) {
  const data = req.body;

  const name = data.name;
  if (!name) {
    return next(new errors.BadRequestError("Name is required"));
  }

  const role = data.role;
  if (!role) {
    return next(new errors.BadRequestError("Role is required"));
  }

  let ticket_type = data.ticketType;

  let group_id = data.groupId;
  if (!group_id) {
    return next(new errors.BadRequestError("Group is required"));
  }

  let status_id = data.statusId;
  if (!status_id) {
    return next(new errors.BadRequestError("Status is required"));
  }

  let project_id = data.projectId;
  if (!project_id) {
    return next(new errors.BadRequestError("Project is required"));
  }

  let release_id = data.releaseId;
  if (!release_id) {
    return next(new errors.BadRequestError("Release Id is required"));
  }

  const type = data.type;
  if (!type) {
    return next(new errors.BadRequestError("Type is required"));
  }

  const show_current_user = data.showCurrentUser;
  if (!show_current_user) {
    return next(new errors.BadRequestError("Current User is required"));
  }

  const sort = data.sort;
  if (!sort) {
    return next(new errors.BadRequestError("Sort User is required"));
  }

  const status = data.status;
  if (!status) {
    return next(new errors.BadRequestError("IsActive  is required"));
  }

  let excluded_user = data.excludedUser;
  if (!excluded_user) {
    return next(new errors.BadRequestError("ExcludedUser  is required"));
  }

  if (typeof excluded_user === "object") {
    excluded_user = excluded_user.join(",");
  }

  if (typeof release_id === "object") {
    release_id = release_id.join(",");
  }

  if (typeof status_id === "object") {
    status_id = status_id.join(",");
  }

  if (typeof group_id === "object") {
    group_id = group_id.join(",");
  }

  if (typeof project_id === "object") {
    project_id = project_id.join(",");
  }

  if (typeof ticket_type === "object") {
    ticket_type = ticket_type.join(",");
  }

  QuickLinks.create({
    name,
    role,
    ticket_type,
    group_id,
    status_id,
    project_id,
    release_id,
    type,
    show_current_user,
    sort,
    status,
    excluded_user,
  })
    .then((quicklinks) => {
      res.json(201, {
        message: "Quicklinks added",
        quicklinksId: quicklinks.id,
      });
    })
    .catch((err) => {
      req.log.error(err);
      return next(err);
    });
}

module.exports = create;
