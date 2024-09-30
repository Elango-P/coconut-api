const errors = require("restify-errors");
const utils = require("../../lib/utils");
const { CandidateMessage } = require("../../db").models;

const DateTime = require("../../lib/dateTime");

const dateTime = new DateTime();

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
  const candidateId = data.candidateId;
  if (candidateId) {
    where.candidate_id = candidateId;
  }

  CandidateMessage.findAndCountAll({
    where,
    order: [["created_at", "DESC"]],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  }).then((results) => {
    const candidateMessages = [];
    results.rows.forEach((candidateMessage) => {
      candidateMessages.push({
        id: candidateMessage.id,
        candidateId: candidateMessage.candidate_id,
        fromEmail: candidateMessage.from_email,
        toEmail: candidateMessage.to_email,
        message: utils.rawURLDecode(candidateMessage.message),
        formattedDateCandidateMessage: utils.formatLocalDate(
          candidateMessage.created_at,
          dateTime.formats.frontendDateTime12HoursFormat
        ),
        formattedCreatedAtDate: utils.formatDate(
          candidateMessage.created_at,
          "d-M-Y h:m A"
        ),
        createdAt: candidateMessage.created_at,
      });
    });

    const { count, currentPage, lastPage, pageStart, pageEnd } =
      utils.getPageDetails(
        results.count,
        page,
        pageSize,
        candidateMessages.length
      );

    res.json({
      count,
      currentPage,
      lastPage,
      pageStart,
      pageEnd,
      candidateMessages,
    });
  });
}

module.exports = list;
