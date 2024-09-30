const errors = require("restify-errors");

// Models
const { WikiPage } = require("../../db").models;

async function del(req, res, next) {
  try {
    const where = {};
    const id = req.params.id;
    if (id) {
      where.id = id;
    }

    const wikiPage = await WikiPage.findOne({
      where,
    });

    // Is Page Exists
    if (!wikiPage) {
      return next(new errors.NotFoundError("Page not found"));
    }

    // Delete Page
    const pageDelete = wikiPage.destroy();
    if (pageDelete) {
      res.json({ message: "Page deleted" });
    }
  } catch (err) {
    console.log(err);
    req.log.error(err);
    return next(err);
  }
}

module.exports = del;
