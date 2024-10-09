const ObjectName = require("../helpers/ObjectName");
const Permission = require("../helpers/Permission");
const Response = require("../helpers/Response");
const Request = require("../lib/request");
const History = require("./HistoryService");
const errors = require("restify-errors");
const validator = require("../lib/validator");
const DateTime = require("../lib/dateTime")

const { AccountEntry, status: statusModel, Tag ,PaymentAccount,account} = require("../db").models;

const { Op } = require("sequelize");
const Number = require("../lib/Number");
const DataBaseService = require("../lib/dataBaseService");
const tagService = new DataBaseService(Tag);
const accountEntryService = new DataBaseService(AccountEntry);
const accountEntry = require("../helpers/AccountEntry");
const Boolean = require("../lib/Boolean");
const StatusService = require("./StatusService");
const Sequelize = require("sequelize");
const db = require("../db");
const ObjectHelper = require("../helpers/ObjectHelper");


const createAccountEntry = async (data, companyId, statusId) => {
  try {

    async function getNextAccountEntryNumber(query) {
      const lastAccountEntryData = await accountEntryService.findOne(query);
      let account_entry_number;
      let accountEntryNumberData = lastAccountEntryData && lastAccountEntryData.get("account_entry_number");
      if (!accountEntryNumberData) {
        account_entry_number = 1;
      } else {
        account_entry_number = accountEntryNumberData + 1;
      }
      return account_entry_number;
    }

    const query = {
      order: [["created_at", "DESC"]],
      where: { company_id: companyId },
      attributes: ["account_entry_number"]
    }
    companyId
    const account_entry_number = await getNextAccountEntryNumber(query)

    const where = new Object();

    if (data.date) {
      where.date = {
        [Op.gte]: Sequelize.literal(`DATE('${data.date}')`),
        [Op.lte]: Sequelize.literal(`DATE('${data.date}')`),
      };
    }

    if (data.type) {
      where.type = data.type
    }

    if (data.payment_account) {
      where.payment_account = data.payment_account
    }

    if (data.bank_description) {
      where.bank_description = data.bank_description
    }

    if (data.amount) {
      where.amount = data.amount
    }

    if (data.bank_reference_number) {
      where.bank_reference_number = data.bank_reference_number
    }

    where.company_id = companyId;

    const accountEntryDetail = await AccountEntry.findOne({ where })

    if (!accountEntryDetail) {

      const createData = {
        date: data.date,
        type: data.type,
        description: data.description,
        amount: Number.GetFloat(data.amount),
        payment_account: Number.Get(data.payment_account),
        bank_description: data.bank_description,
        status: Number.Get(statusId),
        notes: data.notes,
        company_id: companyId,
        account_entry_number: account_entry_number,
        category_tag_id: Number.Get(data.account_entry_category),
        account: Number.Get(data.account),
        bank_reference_number: data?.bank_reference_number ? data?.bank_reference_number : "",

      };
      const Account = await AccountEntry.create(createData);

      return Account;

    }

    return null;

  } catch (err) {
    console.log(err);
    return null;
  }
}

const create = async (req, res, next) => {
  try {

    const companyId = Request.GetCompanyId(req);

    const data = req.body;

    if (!data) {
      throw { message: "Account details required" };
    }


    const statusId = await StatusService.getFirstStatus(ObjectName.ACCOUNT_ENTRY, companyId);

    const Account = await createAccountEntry(data, companyId, statusId);

    if (Account) {

      History.create(
        `Account Entry created`,
        req,
        ObjectName.ACCOUNT_ENTRY,
        Account.id
      );
    }

    res.json(Response.OK, {
      message: "Account created",
      AccountEntryDetails: Account,
    });

  } catch (err) {

    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
};

const importAccountEntry = async (req, res, next) => {
  try {
    const companyId = Request.GetCompanyId(req);

    const data = req.body;

    if (!data) {
      throw { message: "Import Data Is Required" };
    }

    res.json(Response.OK, {
      message: "Account Entry Imported",
    });

    res.on("finish", async () => {

      const statusId = await StatusService.getFirstStatus(ObjectName.ACCOUNT_ENTRY, companyId);

      if (data && Array.isArray(data) && data.length > 0) {

        for (let i = 0; i < data.length; i++) {

          await createAccountEntry(data[i], companyId, statusId);

        }
      }
    })
  } catch (err) {

    console.log(err);
  }
};

const del = async (req, res, next) => {
  const companyId = Request.GetCompanyId(req);



  const id = req.params.id;

  if (!id) {
    return next(new errors.BadRequestError("Account Entry id is required"));
  }



  accountEntryService.findOne({ where: { id: id, company_id: companyId } })
    .then((accountEntry) => {
      if (!accountEntry) {
        return next(new errors.NotFoundError("Account Entry not found"));
      }

      return accountEntry
        .destroy({ where: { id: id, company_id: companyId } })
        .then(() => res.json({ message: "Account Entry Deleted" }));
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

const get = async (req, res, next) => {
  const companyId = Request.GetCompanyId(req);
  const id = req.params.id;
  if (!id) {
    return next(new errors.BadRequestError("Account entry id is required"));
  }

  if (!validator.isInteger(id)) {
    return next(new errors.BadRequestError("Invalid Account Entry id"));
  }

  accountEntryService.findOne({
    where: { id, company_id: companyId },
  })
    .then(async (data) => {
      if (!data) {
        return next(new errors.NotFoundError("Account Entry not found"));
      }
      let acccountCategoryTag = {}
      if (data.category_tag_id) {
        acccountCategoryTag = await tagService.findOne({ where: { id: data.category_tag_id, company_id: companyId } })
      }
      let accounts = {}
      if (data.account) {
        accounts = await account.findOne({ where: { id: data.account, company_id: companyId } })
      }

      let accountEntryData = data.get();
      const statusData = await statusModel.findOne({ where: { company_id: companyId, id: accountEntryData.status } });
      res.json({
        date: accountEntryData.date,
        type: accountEntryData.type,
        description: accountEntryData.description,
        amount: accountEntryData.amount,
        payment_account: accountEntryData.payment_account,
        bank_description: accountEntryData.bank_description,
        statusName: statusData?.name,
        status: accountEntryData.status,
        colorCode: statusData?.color_code,
        notes: accountEntryData.notes,
        account_entry_category: acccountCategoryTag && acccountCategoryTag?.name,
        account_entry_category_id: acccountCategoryTag && acccountCategoryTag?.id,
        bank_reference_number: accountEntryData?.bank_reference_number,
        accountId: accounts && accounts.id,
        accountName: accounts && accounts?.name,
      });
    })
    .catch((err) => {
      next(err);
    });
}

const search = async (req, res, next) => {
  const companyId = Request.GetCompanyId(req);


  const params = req.query;

  try {
    let { page, pageSize, search, sort, sortDir, pagination, status, type, paymentAccount, endDate, startDate, tag, showTotal } = params;
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      throw { message: "Invalid page" };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      throw { message: "Invalid page size" };
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      date: "date",
      type: "type",
      description: "description",
      amount: "amount",
      payment_account: "payment_account",
      bank_description: "bank_description",
      status: "status",
      notes: "notes",
      created_at: "created_at",
      updated_at: "updated_at",
      account: "account",
      bank_reference_number: "bank_reference_number",
      account_entry_number: "account_entry_number",
      name: "name",
      bill_id: "bill_id"
    };

    const sortParam = sort || "created_at";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      throw { message: `Unable to sort accountEntry by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      throw { message: "Invalid sort order" };
    }

    let timeZone = Request.getTimeZone(req);
    let date = DateTime.getCustomDateTime(req.query?.date, timeZone)

    let where = {};

    if (status) {
      where.status = status;
    }
    where.company_id = companyId;

    if (paymentAccount) {
      where.payment_account = paymentAccount;
    }

    if (tag) {
      where.category_tag_id = tag
    }
    if (type) {
      where.type = type;
    }

    if (startDate && !endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }

    if (endDate && !startDate) {
      where.date = {
        [Op.and]: {
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }

    if (startDate && endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }


    if (date && Number.isNotNull(req?.query?.date)) {
      where.date = {
        [Op.and]: {
          [Op.gte]: date?.startDate,
          [Op.lte]: date?.endDate,
        },
      };
    }


    const accounts = req.query.account
    if (accounts) {
      where.account = accounts
    }
    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          type: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          '$paymentAccountDetail.payment_account_name$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          bank_description: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          notes: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          bank_reference_number: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }
    let order = []
    if (sort == "name") {
      order.push([{ model: Tag, as: 'tagDetail' }, 'name', sortDir])
    }
    else {
      order.push([sortableFields[sortParam], sortDirParam])
    }

    const query = {
      attributes: { exclude: ["deletedAt"] },
      order,
      where,
      include: [
        {
          model: Tag,
          as: "tagDetail",
          required: false,
        },
        {
          model: PaymentAccount,
          as: "paymentAccountDetail",
          required: false,
        },
        {
          model: account,
          as: "accountDetail",
          required: false,
        },
        {
          required: false,
          model: statusModel,
          as: 'statusDetail',
        },
      ]
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


    let quaryParams = {
      company_id: companyId,
      status: status,
      payment_account: paymentAccount,
      category_tag_id: tag,
      type: type,
      account: accounts,
      startDate,
      endDate: DateTime.toGetISOStringWithDayEndTime(endDate),
      searchTerm: searchTerm
    }

    let totalAmount = await getTotalAmount(quaryParams);

    // Get customer list and count
    const AccountEntries = await accountEntryService.findAndCount(query);
    const AccountEntryData = [];

    AccountEntries.rows.forEach(accountEntry => {
      const accountEntryDetails = { ...accountEntry.get() };
      const { tagDetail,accountDetail } = accountEntryDetails

      AccountEntryData.push({
        id: accountEntryDetails.id,
        date: DateTime.Format(accountEntryDetails.date),
        type: accountEntryDetails.type,
        notes: accountEntryDetails.notes,
        payment_account: accountEntry && accountEntry?.paymentAccountDetail?.payment_account_name,
        paymentAccountId:accountEntry && accountEntry?.paymentAccountDetail?.id,
        bank_description: accountEntryDetails.bank_description,
        amount: accountEntryDetails.amount,
        status: accountEntry && accountEntry?.statusDetail?.name,
        description: accountEntryDetails.description,
        account_category: tagDetail && tagDetail?.name,
        account: accountDetail && accountDetail?.name,
        account_id:accountEntryDetails?.account,
        account_entry_number: accountEntryDetails.account_entry_number,
        account_entry_category_id: tagDetail && tagDetail?.id,
        bank_reference_number: accountEntryDetails?.bank_reference_number ? accountEntryDetails?.bank_reference_number :"",
        bill_id:accountEntryDetails?.bill_id,
      });
    });

    if (AccountEntryData && AccountEntryData?.length > 0 && showTotal) {
      let lastRecord = ObjectHelper.createEmptyRecord(AccountEntryData[0]);
      lastRecord.amount = totalAmount || "";
      AccountEntryData.push(lastRecord);
    }

    res.send(Response.OK, {
      totalCount: AccountEntries.count,
      currentPage: page,
      pageSize,
      data: AccountEntryData ? AccountEntryData : [],
      sort,
      sortDir,
      search,
      status,
      totalAmount
    });

  } catch (err) {

    res.json(Response.BAD_REQUEST, {
      message: err.message
    });
  }

}

const update = async (req, res, next) => {

  const companyId = Request.GetCompanyId(req);
  const data = req.body;
  const { id } = req.params;

  try {
    const accountEntryDetails = await accountEntryService.findOne({
      where: { id, company_id: companyId },
    });
    if (!accountEntryDetails) {
      throw { message: "Account Entry not found" };
    }

    const updateData = {
      date: data.date,
      type: data.type,
      description: data.description,
      amount: data.amount,
      payment_account: data.payment_account,
      bank_description: data.bank_description,
      status: data.status,
      notes: data.notes,
      company_id: companyId,
      ...(data.account_entry_category ? {category_tag_id: Number.Get(data.account_entry_category)}:""),
      ...(data.account ? {account: Number.Get(data.account)}:""),
      bank_reference_number: data?.bank_reference_number,
      bill_id:data?.bill_id
    }
    await accountEntryService.update(updateData, {
      where: { id, company_id: companyId  },
    });
    //create a log
    History.create(`AccountEntry updated`, req, ObjectName.ACCOUNT_ENTRY, id);

    res.json(Response.OK, {
      message: "AccountEntry updated",
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}


const bulkUpdate =async (req,res)=>{
  const companyId = Request.GetCompanyId(req);
  const data = req.body;
  const { ids } = req.params;
  let accountEntryIds  =  ids && ids.split(",");
  if(accountEntryIds && !accountEntryIds.length >0){
    return res.json(400,{message:"Account Entry Id Required"})
  }
  try {
    const updateData = { }

    if(data?.account_entry_category){
      updateData.category_tag_id = data?.account_entry_category
    }

    if(data?.account){
      updateData.account = Number.Get(data?.account)
    }

    if(data?.amount){
      updateData.amount = data?.amount
    }

    if(data?.notes){
      updateData.notes = data?.notes
    }

    if(data?.payment_account){
      updateData.payment_account = data?.payment_account
    }

    if(data?.status){
      updateData.status = data?.status
    }

    if(data?.type){
      updateData.type = data?.type
    }

    for (let i = 0; i < accountEntryIds.length; i++) {
      const id = accountEntryIds[i];
      await accountEntryService.update(updateData, {
        where: { id:id, company_id: companyId },
      });
      createAuditLog(data,id,req)
    }
   
    res.json(Response.OK, {
      message: "AccountEntry Bulk updated",
    });
  } catch (err) {
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
}

const createAuditLog=(data,id,req) =>{
  let auditLogMessage = new Array();

    if(data?.account_entry_category){
      auditLogMessage.push(`Category Changed to ${data?.account_entry_category_name}\n`);
    }

    if(data?.account){
      auditLogMessage.push(`Account Changed to ${data?.accountName}\n`);
    }

    if(data?.amount){
      auditLogMessage.push(`Amount Changed to ${data?.amount}\n`);
    }

    if(data?.notes){
      auditLogMessage.push(`Notes Changed to ${data?.notes}\n`);
    }

    if(data?.payment_account){
      auditLogMessage.push(`Payment Account Changed to ${data?.payment_account_name}\n`);
    }

    if(data?.status){
      auditLogMessage.push(`Status Changed to ${data?.statusName}\n`);
    }

    if(data?.type){
      auditLogMessage.push(`Type Changed to ${data?.typeName}\n`);
    }
   

    if (auditLogMessage && auditLogMessage.length > 0) {
      let message = auditLogMessage.join();
      History.create(message,req,ObjectName.ACCOUNT_ENTRY,id);
    } else {
      History.create("Account Entry Updated", req, ObjectName.ACCOUNT_ENTRY, id);
    }
}

const getTotalAmount=async (params)=>{

let whereCondition=""

params?.status ? whereCondition += ` AND "account_entry"."status" = ${params?.status}` :""
params?.payment_account ? whereCondition +=  ` AND "account_entry"."payment_account" = ${params?.payment_account}` :""
params?.category_tag_id ? whereCondition += ` AND "account_entry"."category_tag_id" = ${params?.category_tag_id}` :""
params?.type ? whereCondition += ` AND "account_entry"."type" = '%${params?.searchTerm}%'` :""
params?.account ?  whereCondition += ` AND "account_entry"."account" = ${params?.account}` :""
params?.searchTerm && isNaN(Number.Get(params?.searchTerm)) ? whereCondition += ` AND ("account_entry"."type" ILIKE '%${params?.searchTerm}%' OR "account_entry"."description" ILIKE '%${params?.searchTerm}%' OR "account_entry"."bank_description" ILIKE '%${params?.searchTerm}%' OR "account_entry"."notes" ILIKE '%${params?.searchTerm}%' OR "payment_account"."payment_account_name" ILIKE '%${params?.searchTerm}%')` : ""
params?.searchTerm && !isNaN(Number.Get(params?.searchTerm)) ? whereCondition += ` AND "account_entry"."bank_reference_number" = ${params?.searchTerm}` : ""
params?.startDate ? whereCondition += ` AND "account_entry"."date" >= '${params?.startDate}'` : ""
params?.endDate ? whereCondition += ` AND "account_entry"."date" <= '${params?.endDate}'` : ""

  const rawQuery = `
  SELECT COALESCE(SUM("account_entry"."amount"),0) AS "totalAmount"
  FROM "account_entry"
  LEFT JOIN "payment_account" ON "account_entry"."payment_account" = "payment_account"."id"
  WHERE "account_entry"."company_id"=${params?.company_id}
  AND "account_entry"."deleted_at" IS NULL
  ${whereCondition}
  `;

  const totalAmountResult = await db.connection.query(rawQuery, {
    type: Sequelize.QueryTypes.SELECT,
  });

  const totalAmount1 = totalAmountResult && totalAmountResult[0].totalAmount;
  return totalAmount1
}

module.exports = {
  create,
  del,
  get,
  search,
  update,
  importAccountEntry,
  bulkUpdate,
  createAuditLog,
  getTotalAmount
}