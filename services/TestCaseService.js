const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const Boolean = require("../lib/Boolean");
const Request = require("../lib/request");
const History = require("./HistoryService");
const { TestCase } = require("../db").models;
const validator = require("../lib/validator");
const DataBaseService = require("../lib/dataBaseService");
const { Op } = require("sequelize");
const Url = require("../lib/Url");
const Number = require("../lib/Number");
const String = require("../lib/string");
const TestCaseModel = new DataBaseService(TestCase);

class TestCaseService {
  static async create(req, res, next) {
    try {
      const companyId = Request.GetCompanyId(req);

      if (!companyId) {
        res.json(BAD_REQUEST, { message: "Company Id Required" });
      }

      const data = req.body;
      const TestNumber = async (companyId) => {
        try {
          //get the order detail
          let testDetail = await TestCase.findOne({
            order: [["id", "DESC"]],
            where: { company_id: companyId, ticket_id: data?.ticketId },
          });
          if (testDetail && testDetail?.test_number) {
            return testDetail && parseInt(testDetail?.test_number) + 1;
          } else {
            return 1;
          }
        } catch (err) {
          console.log(err);
        }
      };
      let createData = {
        company_id: companyId,
        test_scenario: String.Get(data?.testScenario),
        test_steps: String.Get(data?.testSteps),
        prerequisites: String.Get(data?.prerequisites),
        test_data: String.Get(data?.testData),
        expected_result: String.Get(data?.expectedResult),
        ticket_id: data?.ticketId,
        test_number: await TestNumber(companyId),
      };

      await TestCase.create(createData).then((response) => {
        res.on("finish", async () => {
          History.create("Test Case Added", req, ObjectName.TEST_CASE, response?.id);
        });

        res.json(Response.OK, {
          message: "Test Case Added ",
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination, ticket_id } = req.query;
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: "Invalid page size" });
    }

    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(400, "Company Not Found");
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      test_scenario: "test_scenario",
      test_steps: "test_steps",
      prerequisites: "prerequisites",
      test_data: "test_data",
      expected_result: "expected_result",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      test_number: "test_number",
    };

    const sortParam = sort || "createdAt";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort Test Case by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }

    const where = {};

    where.company_id = companyId;

    if (Number.isNotNull(ticket_id)) {
      where.ticket_id = ticket_id;
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
            test_scenario: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }



    const query = {
    order:[[sortParam, sortDirParam]],
      where,
    };
    if (validator.isEmpty(pagination)) {
      pagination = true;
    }
    if (Boolean.isTrue(pagination)) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }
    try {
      let TestCasesList = await TestCase.findAndCountAll(query);
      let data = [];
      if (TestCasesList && TestCasesList.rows && TestCasesList.rows.length > 0) {
        for (let i = 0; i < TestCasesList.rows.length; i++) {
          const {
            id,
            test_scenario,
      test_steps,
      prerequisites,
      test_data,
      expected_result,
      test_number
          } = TestCasesList.rows[i];
          data.push({
            id,
            test_number: test_number,
            test_scenario: String.Get(test_scenario),
            test_steps: String.Get(test_steps),
            prerequisites: String.Get(prerequisites),
            test_data: String.Get(test_data),
            expected_result: String.Get(expected_result)
          });
        }
      }

      res.json(Response.OK, {
        totalCount: TestCasesList.count,
        currentPage: page,
        pageSize,
        data,
        search,
        sort,
        sortDir,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const companyId = Request.GetCompanyId(req);

      let query = {
        where: { company_id: companyId, id: id },
      };

      const testCasesDetail = await TestCase.findOne(query);

      if (!testCasesDetail) {
        return res.json(400,{ message: "Test Case not found" });
      }

      let updateData = {
        test_scenario: String.Get(data?.testScenario),
        test_steps: String.Get(data?.testSteps),
        prerequisites: String.Get(data?.prerequisites),
        test_data: String.Get(data?.testData),
        expected_result: String.Get(data?.expectedResult),
      };

      await testCasesDetail.update(updateData);

      res.json(
        200,
        {
          message: "Test Case Updated",
        },
        id
      );

      res.on("finish", () => {
        History.create("Test Case updated", req, ObjectName.TEST_CASE, id);
      });
    } catch (err) {
      console.log(err);
      res.json(400, { message: err.message });
    }
  }

  static async del(req, res) {
    try {
      const { id } = req.params;

      const company_id = Request.GetCompanyId(req);

      if (!id) {
        return res.json(BAD_REQUEST, { message: "Test Case id is required" });
      }
      const testCasesDetail = await TestCase.findOne({
        where: { id: id, company_id },
      });
      if (!testCasesDetail) {
        return res.json(BAD_REQUEST, { message: "Test Case not found" });
      }

      await testCasesDetail.destroy();

      res.on("finish", async () => {
        History.create("Test Case deleted", req, ObjectName.TEST_CASE, id);
      });
      res.json(Response.DELETE_SUCCESS, { message: "Test Case deleted" });
    } catch (err) {
      console.log(err);
    }
  }

 
}

module.exports = TestCaseService;
