const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const Boolean = require("../lib/Boolean");
const Request = require("../lib/request");
const History = require("./HistoryService");
const { TicketTestCase, Tag } = require("../db").models;
const validator = require("../lib/validator");
const DataBaseService = require("../lib/dataBaseService");
const { Op } = require("sequelize");
const Url = require("../lib/Url");
const Number = require("../lib/Number");
const TestCaseModel = new DataBaseService(TicketTestCase);

class TicketTestCaseService {
  static async create(req, res, next) {
    try {
      const companyId = Request.GetCompanyId(req);
      const userId = Request.getUserId(req);

      if (!companyId) {
        res.json(BAD_REQUEST, { message: "Company Id Required" });
      }
      const TicketTestNumber = async (companyId) => {
        try {
          let ticketTestDetail = await TicketTestCase.findOne({
            order: [["id", "DESC"]],
            where: { company_id: companyId, project_id: data?.project_id },
          });
          if (ticketTestDetail && ticketTestDetail?.test_case_id) {
            return ticketTestDetail && parseInt(ticketTestDetail?.test_case_id) + 1;
          } else {
            return 1;
          }
        } catch (err) {
          console.log(err);
        }
      };

      const data = req.body;
      let createData = {
        name: data?.name,
        description: data?.name,
        expected_result: data?.expectedResult,
        prerequisite: data?.prerequisite,
        test_data: data?.testData,
        test_steps: data?.testSteps,
        company_id: companyId,
        project_id: data?.project_id,
        summary: data?.summary ? data?.summary : "",
        user_id: data?.user_id ? data?.user_id : userId,
        module_tag_id: data?.moduleTag ? data?.moduleTag : null,
        comments: data?.comments,
        test_case_id: await TicketTestNumber(companyId)
      };

      await TicketTestCase.create(createData).then((response) => {
        res.on("finish", async () => {
          History.create(" Ticket Test Case Add", req, ObjectName.TICKET_TEST_CASE, response?.id);
        });

        res.json(Response.OK, {
          message: "Ticket Test Case Added",
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination, project_id } = req.query;
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
      name: "name",
      module_tag_id: "module_tag_id",
      test_case_id: "test_case_id",
      expected_result: "expected_result",
      prerequisite: "prerequisite",
      test_data: "test_data",
      description: "description",
      test_steps: "test_steps",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };

    const sortParam = sort || "test_case_id";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort Team by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }

    const where = {};

    where.company_id = companyId;

    if (Number.isNotNull(project_id)) {
      where.project_id = project_id;
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    let order = [];

    if (sort == "module_tag_id") {
      order.push([{ model: Tag, as: "tagDetail" }, "name", sortDirParam]);
    } else {
      order.push([sortParam, sortDirParam]);
    }

    const query = {
      include: [
        {
          required: false,
          model: Tag,
          as: "tagDetail",
        },
      ],
      order: order,
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
      let TestCaseList = await TestCaseModel.findAndCount(query);
      let data = [];
      if (TestCaseList && TestCaseList.rows && TestCaseList.rows.length > 0) {
        for (let i = 0; i < TestCaseList.rows.length; i++) {
          const {
            id,
            name,
            description,
            test_data,
            prerequisite,
            expected_result,
            test_steps,
            module_tag_id,
            tagDetail,
            comments,
            test_case_id
          } = TestCaseList.rows[i];
          data.push({
            id,
            name: name,
            description,
            expectedResult: expected_result ? expected_result : "",
            prerequisite: prerequisite ? prerequisite : "",
            testData: test_data ? test_data : "",
            testSteps: test_steps ? test_steps : "",
            moduleTag: module_tag_id,
            moduleTagName: tagDetail?.name ? tagDetail?.name : "",
            comments: comments,
            test_case_id: test_case_id
          });
        }
      }

      res.json(Response.OK, {
        totalCount: TestCaseList.count,
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

      const testCaseDetail = await TicketTestCase.findOne(query);

      if (!testCaseDetail) {
        return res.status(404).json({ message: "Ticket Test Case not found" });
      }

      let updateData = {
        name: data?.name,
        description: data?.description,
        expected_result: data?.expectedResult,
        prerequisite: data?.prerequisite,
        test_data: data?.testData,
        test_steps: data?.testSteps,
        module_tag_id: data?.moduleTag,
        comments: data?.comments,
      };

      await testCaseDetail.update(updateData);

      res.json(
        200,
        {
          message: "Ticket Test Case Updated",
        },
        id
      );

      res.on("finish", () => {
        History.create("Ticket Test Case updated", req, ObjectName.TICKET_TEST_CASE, id);
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
        return res.json(BAD_REQUEST, { message: "Ticket Test Case id is required" });
      }
      const testCaseDetail = await TicketTestCase.findOne({
        where: { id, company_id },
      });
      if (!testCaseDetail) {
        return res.json(BAD_REQUEST, { message: "Ticket Test Case not found" });
      }

      await testCaseDetail.destroy();

      res.on("finish", async () => {
        History.create("Ticket Test Case deleted", req, ObjectName.TICKET_TEST_CASE, id);
      });
      res.json(Response.DELETE_SUCCESS, { message: "Ticket Test Case deleted" });
    } catch (err) {
      console.log(err);
    }
  }

  static async get(req, res, next) {
    const { id: testCaseId } = req.params;

    try {
      const company_id = Request.GetCompanyId(req);

      if (!testCaseId) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid Id" });
      }

      const TestCaseDetail = await TicketTestCase.findOne({
        where: {
          id: testCaseId,
          company_id: company_id,
        },
        include: [
          {
            required: false,
            model: Tag,
            as: "tagDetail",
          },
        ],
      });

      if (!TestCaseDetail) return res.json(Response.OK, { message: "No Records Found" });
      let {
        id,
        project_id,
        test_steps,
        module_tag_id,
        name,
        description,
        prerequisite,
        test_data,
        expected_result,
        tagDetail,
        comments,
      } = TestCaseDetail.get();

      let data = {
        id,
        project_id,
        testSteps: test_steps,
        moduleTag: module_tag_id,
        name,
        description,
        prerequisite,
        testData: test_data,
        expectedResult: expected_result,
        moduleTagName: tagDetail?.name,
        comments,
      };

      res.json(Response.OK, data);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = TicketTestCaseService;
