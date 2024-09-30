const errors = require("restify-errors");
const path = require("path");
const { models } = require("../../db");

// Utils
const utils = require("../../lib/utils");

// Models
const { User, Screenshot } = models;

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

  const validOrder = ["ASC", "DESC"];
  const sortableFields = {
    id: "id",
    image: "image",
    systemName: "system_name",
    ipAddress: "ip_address",
    version: "version",
  };

  const sort = data.sort || "id";
  if (!Object.keys(sortableFields).includes(sort)) {
    return next(
      new errors.BadRequestError(`Unable to sort tickets by ${sort}`)
    );
  }

  const sortDir = data.sortDir || "DESC";
  if (!validOrder.includes(sortDir)) {
    return next(new errors.BadRequestError("Invalid sort order"));
  }

  const where = {};
  const dateFilter = utils.getDateFilter("", data.fromDate, data.toDate, true);
  if (dateFilter) {
    where.date = dateFilter;
  }

  const screenshotCondition = {
    attributes: [
      "id",
      "image",
      "system_name",
      "ip_address",
      "user_id",
      "version",
      "created_at",
    ],
    where,
    order: [[`${sortableFields[sort]}`, `${sortDir}`]],
    include: [
      {
        model: User,
        required: true,
        as: "user",
      },
    ],
  };

  if (pageSize > 0) {
    screenshotCondition.limit = pageSize;
    screenshotCondition.offset = (page - 1) * pageSize;
  }

  Screenshot.findAndCountAll(screenshotCondition).then((screenshots) => {
    const screenshotList = [];
    screenshots.rows.forEach((screenshot) => {
      screenshot = screenshot.get();

      const image = screenshot.image;

      const extension = path.extname(image);
      const thumbnail = `${path.basename(image, extension)}-thumb${extension}`;

      screenshotList.push({
        id: screenshot.id,
        image,
        thumbnail,
        systemName: screenshot.system_name,
        ipAddress: screenshot.ip_address,
        userName: screenshot.user.get().name,
        version: screenshot.version,
        createdAt: screenshot.created_at,
      });
    });

    const { count, currentPage, lastPage, pageStart, pageEnd } =
      utils.getPageDetails(
        screenshots.count,
        page,
        pageSize,
        screenshotList.length
      );

    res.json({
      count,
      currentPage,
      lastPage,
      pageStart,
      pageEnd,
      screenshots: screenshotList,
    });
  });
}

module.exports = list;
