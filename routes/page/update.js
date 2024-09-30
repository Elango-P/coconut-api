const errors = require("restify-errors");

// Models
const { WikiPage } = require("../../db").models;

// Utils
const utils = require("../../lib/utils");

// Constants
const constants = require("../../lib/constants");

async function update(req, res, next) {
  try {
    const data = req.body;

    const where = {};
    const id = req.params.id;
    if (id) {
      where.id = id;
    }

    // Get Page Details
    const pageDetails = await WikiPage.findOne({
      where,
    });

    // Page Not Found
    if (!pageDetails) {
      return next(new errors.BadRequestError("Page not found"));
    }

    const status = data.status;

    //To Update  Page Data
    pageDetails.update({
      title: data.title,
      content: utils.rawURLEncode(data.content),
      status: data.status,
      updated_by: req.user.id,
      slug: data.slug.replace(/\s+/g, "-").toLowerCase()
        ? data.slug.replace(/\s+/g, "-").toLowerCase()
        : data.title.replace(/\s+/g, "-").toLowerCase(),
    });

    let pageStatus = "Saved";
    if (status === constants.PUBLISH) {
      pageStatus = "Published";
    }

    // Success Message
    res.json({
      message: `Page ${pageStatus} Successfully`,
    });
  } catch (error) {
    console.log(err);
    req.log.error(error);
    next(error);
  }
}

module.exports = update;
