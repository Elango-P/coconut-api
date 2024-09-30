const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const Request = require("../lib/request");
const History = require("./HistoryService");
const { TicketTest:TicketTestModel, Media: MediaModel } = require("../db").models;
const mediaService = require("./MediaService");
const TicketTest = require("../helpers/TicketTest");

class TicketTestService {
  static async create(req, res) {
    let data = req.body;
    let companyId = Request.GetCompanyId(req);
    let userId = Request.getUserId(req);

    if (!data.ticket_id) {
      return res.json(BAD_REQUEST, { message: "Ticket id is required" });
    }

    if (!companyId) {
      return res.json(BAD_REQUEST, { message: "Company id is required" });
    }

    const TestNumber = async (companyId) => {
      try {
        //get the order detail
        let testDetail = await TicketTestModel.findOne({
          order: [["id", "DESC"]],
          where: { company_id: companyId, ticket_id: data?.ticket_id },
        });

        if (testDetail) {
          return testDetail && parseInt(testDetail.test_number) + 1;
        } else {
          return 1;
        }
      } catch (err) {
        console.log(err);
      }
    };

    let createData = {
      user_id: userId,
      ticket_id: data?.ticket_id,
      summary: data?.summary ? data?.summary : "",
      result: data?.result,
      test_number: await TestNumber(companyId),
      company_id: companyId,
    };
    await TicketTestModel.create(createData)
      .then((response) => {
        res.json(Response.OK, {
          message: "Ticket Test Added",
          id: response.id,
        });
        res.on("finish", () => {
          History.create("Ticket Test Added", req, ObjectName.TICKET_TEST, response.id);
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json(400, { message: err.message });
      });
  }

  static async search(req, res) {
    let { page, pageSize, search, sort, sortDir, pagination, ticket_id } = req.query;

    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page) || page < 1) {
        return res.json(BAD_REQUEST, { message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize) || pageSize < 1) {
        return res.json(BAD_REQUEST, { message: "Invalid page size" });
    }

    const companyId = Request.GetCompanyId(req);

    const userId = Request.getUserId(req);

    if (!companyId) {
      return res.json(400, { message: "Company Id Not Found" });
    }

    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      created_at: "created_at",
      updated_at: "updated_at",
      summary: "summary",
      result: "result",
    };

    const sortParam = sort || "created_at";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, {
        message: `Unable to sort product by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, {
        message: "Invalid sort order",
      });
    }

    const where = {};
    where.company_id = companyId;

    if (ticket_id) {
      where.ticket_id = ticket_id;
    }

    const query = {
      order: [[sortParam, sortDirParam]],
      where,
    };

    if (pagination !== 'false') {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    await TicketTestModel.findAndCountAll(query)
      .then(async (response) => {
        let testList = response && response.rows;

        let data = [];

        for (let i = 0; i < testList.length; i++) {
          const { id, ticket_id, summary, user_id, test_number, updated_at, result } = testList[i];

          const getMediaId = await MediaModel.findOne({
            where: { object_id: id, object_name: ObjectName.TICKET_TEST, company_id: companyId },
          });

          let list = {
            id: id,
            ticket_id: ticket_id,
            test_number: test_number,
            result:
              result == TicketTest.RESULT_PASSED
                ? TicketTest.RESULT_PASSED_TEXT
                : result == TicketTest.RESULT_FAILED
                ? TicketTest.RESULT_FAILED_TEXT
                : "",
            result_id: result,
            summary: summary ? summary : "",
            user_id: user_id ? user_id : "",
            updated_at: updated_at ? updated_at : "",
            media_url: await mediaService.getMediaURL(getMediaId?.id, companyId),
          };

          data.push(list);
        }

        res.json(Response.OK, {
          totalCount: response.count,
          currentPage: page,
          pageSize,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
      });
  }

  static async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    let companyId = Request.GetCompanyId(req);

    if (!id) {
      return res.json(BAD_REQUEST, { message: "Test id required" });
    }
    if (!companyId) {
      return res.json(BAD_REQUEST, { message: "CompanyId required" });
    }
    let fileDetail = req && req.files && req.files.media_file;
    let TestDetail = await TicketTestModel.findOne({
      where: { id: id, company_id: companyId },
    });

    if (!TestDetail) {
      return res.json(BAD_REQUEST, { message: "Test Not Found" });
    }

    let updateData = {
      result: data?.result,
      summary: data?.summary,
    };

    if (fileDetail && fileDetail !== undefined) {
      let MediaDetail = await MediaModel.findOne({
        where: { object_id: id, company_id: companyId, object_name: ObjectName.TICKET_TEST },
      });
      if (MediaDetail) {
        await MediaDetail.destroy();
      }
    }

    TestDetail.update(updateData)
      .then((response) => {
        res.on("finish", async () => {
          History.create("Test Updated", req, ObjectName.TICKET_TEST, id);
        });

        res.json(Response.OK, {
          message: "Test Update",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async delete(req, res, next) {
    let id = req.body;
    const companyId = Request.GetCompanyId(req);

    let TestDetail = await TicketTestModel.findOne({
      where: { id: id, company_id: companyId },
    });
    if (!TestDetail) {
      return res.json(BAD_REQUEST, { message: "Test Not Found" });
    }
    TestDetail.destroy()
      .then(() => {
        res.json({ message: "Test Deleted" });
        res.on("finish", async () => {
          History.create("Test Deleted", req, ObjectName.TICKET_TEST, id);
        });
      })
      .catch((err) => {
        req.log.error(err);
        next(err);
      });
  }

  static getDetails = async (ticket_id, company_id) => {
    let where = {};

    if (ticket_id) {
      where.ticket_id = ticket_id;
    }

      where.company_id = company_id;

    let testDetail = await TicketTestModel.findAndCountAll({ where: where });

    return testDetail && testDetail;
  };
}

module.exports = TicketTestService;
