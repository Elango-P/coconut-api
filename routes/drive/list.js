const errors = require("restify-errors");
const utils = require("../../lib/utils");
const { Op } = require("sequelize");

const { Drive, DriveFileCategory, User } = require("../../db").models;

function list(req, res, next) {
  const data = req.query;

  const page = data.page ? parseInt(data.page, 10) : 1;
  if (isNaN(page)) {
    return next(new errors.BadRequestError("Invalid page"));
  }

  const pageSize = data.pageSize ? parseInt(data.pageSize, 10) : 20;
  if (isNaN(pageSize)) {
    return next(new errors.BadRequestError("Invalid page size"));
  }

  const where = {};
  const title = data.title;
  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }

  const searchText = data.search;
  if (searchText) {
    where[Op.or] = [
      { title: { [Op.like]: `%${searchText}%` } },
      ["DriveFileCategory.name LIKE ?", `%${searchText}%`],
      ["user.name LIKE ?", `%${searchText}%`],
    ];
  }

  Drive.findAndCountAll({
    attributes: ["id", "category_id", "owner_id", "title", "media_name"],
    where,
    include: [
      {
        required: true,
        model: DriveFileCategory,
        as: "drive_file_category",
        attributes: ["name"],
      },
      {
        required: true,
        model: User,
        as: "user",
        attributes: ["name"],
      },
      {
        required: true,
        model: User,
        as: "driveOwner",
        attributes: ["name"],
      },
    ],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  }).then((results) => {
    const documents = [];
    results.rows.forEach((drives) => {
      documents.push({
        id: drives.id,
        categoryId: drives.category_id,
        categoryName: drives.drive_file_category.get().name,
        ownerId: drives.owner_id,
        ownerName: drives.driveOwner.get().name,
        title: utils.rawURLDecode(drives.title),
        updatedBy: drives.updated_by,
        UpdatedId: drives.user.get().name,
        mediaName: drives.media_name,
        documentPath: utils.getDocumentUrl(drives.media_name),
      });
    });
    const { count, currentPage, lastPage, pageStart, pageEnd } =
      utils.getPageDetails(results.count, page, pageSize, documents.length);

    res.json({
      count,
      currentPage,
      lastPage,
      pageStart,
      pageEnd,
      documents,
    });
  }).catch((err)=>{
    console.log(err);
  })
}

module.exports = list;
