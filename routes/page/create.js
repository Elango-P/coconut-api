const errors = require("restify-errors");

// Models
const { WikiPage } = require("../../db").models;

const { DRAFT } = require("../../helpers/Page");

async function create(req, res, next) {
  try {
    const data = req.body;
    // Validate Title
    if (!data.title) {
      return next(new errors.BadRequestError("Title is required"));
    }

    WikiPage.findOne({
      where: { title: data.title },
    }).then((PageDetails) => {
      // Is Page Exists
      if (PageDetails) {
        return next(new errors.BadRequestError("Page already exists"));
      }

      const slugURL = data.title.replace(/\s+/g, "-").toLowerCase();

      // Create Page
      const PageCreate = WikiPage.create({
        title: data.title,
        created_by: req.user.id,
        slug: slugURL,
        status : DRAFT,
      });

      // Create PageCreate
      if (PageCreate) {
        res.json(201, {
          message: "Page added",
        });
      }
    });
  } catch (err) {
    console.log(err);
    req.log.error(err);
    next(err);
  }
}

module.exports = create;
