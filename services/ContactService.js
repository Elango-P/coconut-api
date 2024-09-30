// Utils

const { Op, Sequelize } = require('sequelize');
const ContactStatus = require('../helpers/ContactStatus');
const Response = require('../helpers/Response');
const { BAD_REQUEST, OK } = require('../helpers/Response');
const DateTime = require('../lib/dateTime');
const Request = require('../lib/request');
const String = require('../lib/string');
const History = require('./HistoryService');
const ObjectName = require("../helpers/ObjectName");
const Contact = require('../helpers/Contact');
const Number = require("../lib/Number");
const Boolean = require("../lib/Boolean");
const validator = require("../lib/validator");

// Models
const { contact } = require('../db').models;
/**
 * Contact search route
 */
const search = async (req, res, next) => {
  let { page, pageSize, search, sort, sortDir, pagination, object_id, object_name } = req.query;

  // Validate if page is not a number
  page = page ? parseInt(page, 10) : 1;
  if (isNaN(page)) {
    return res.json(BAD_REQUEST, { message: 'Invalid page' });
  }

  // Validate if page size is not a number
  pageSize = pageSize ? parseInt(pageSize, 10) : 25;
  if (isNaN(pageSize)) {
    return res.json(BAD_REQUEST, { message: 'Invalid page size' });
  }

  const companyId = req.user && req.user.company_id;

  if (!companyId) {
    return res.json(400, 'Company Not Found');
  }

  // Sortable Fields
  const validOrder = ['ASC', 'DESC'];
  const sortableFields = {
    id: 'id',
    first_name: 'first_name',
    last_name: 'last_name',
    status: 'status',
    mobile: 'mobile',
    email: 'email',
    object_name: 'object_name',
    createdAt: 'createdAt',
    designation: 'designation',
    country: 'country',
    state: 'state',
  };

  const sortParam = sort || 'name';

  // Validate sortable fields
  if (!Object.keys(sortableFields).includes(sortParam) && sortParam !== 'name') {
    return res.json(BAD_REQUEST, { message: `Unable to sort vendor by ${sortParam}` });
  }

  const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
  // Validate order is present in sortDir param
  if (!validOrder.includes(sortDirParam)) {
    return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
  }

  // Get data
  const data = req.query;

  const where = {};

  where.company_id = companyId;

  if (Number.isNotNull(object_id)) {
    where.object_id = object_id;
  }

  if (Number.isNotNull(object_name)) {
    where.object_name = object_name;
  }

  // Search by name
  const searchTerm = search ? search.trim() : null;
  if (searchTerm) {
    where[Sequelize.Op.or] = [
      Sequelize.where(
        Sequelize.fn(
          "concat",
          Sequelize.col("first_name"),
          " ",
          Sequelize.col("last_name")
        ),
        {
          [Sequelize.Op.iLike]: `%${searchTerm}%`,
        }
      ),
      {
        first_name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        last_name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        email: {
          [Sequelize.Op.like]: `%${searchTerm}%`,
        },
      },
      Sequelize.where(
        Sequelize.cast(Sequelize.col("mobile"), "varchar"),
        {
          [Sequelize.Op.like]: `%${searchTerm}%`,
        }
      ),
    ];
  }

  // Search by status
  const status = data.status;
  if (status) {
    where.status = status;
  }

  // Prepare sorting
  const order = [];
  if (sortParam === 'name') {
    order.push([
      Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')),
      sortDirParam
    ]);
  } else {
    order.push([sortableFields[sortParam], sortDirParam]);
  }

  // Get data from Database
  const query = {
    attributes: [
      'id',
      'first_name',
      'last_name',
      'email',
      'mobile',
      'work_phone',
      'object_name',
      'status',
      'company_id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'designation'
    ],
    order,
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
    const detail = await contact.findAndCountAll(query);

    const Data = [];
    detail.rows.forEach((data) => {
      const {
        id,
        first_name,
        last_name,
        email,
        mobile,
        object_id,
        object_name,
        status,
        createdAt,
        updatedAt,
        work_phone,
        designation,
      } = data.get();
      Data.push({
        id,
        name: String.concatName(first_name, last_name),
        email,
        first_name,
        last_name,
        mobile,
        work_phone,
        object_name: object_name,
        status_id: status,
        designation,
        status:
          status == ContactStatus.ACTIVE
            ? ContactStatus.STATUS_ACTIVE_TEXT
            : status == ContactStatus.INACTIVE
              ? ContactStatus.STATUS_INACTIVE_TEXT
              : '',
        createdAt: DateTime.defaultDateFormat(createdAt),
        updatedAt: DateTime.defaultDateFormat(updatedAt),
      });
    });

    res.json(OK, {
      totalCount: detail.count,
      currentPage: page,
      pageSize,
      data: Data,
      search,
      sort,
      sortDir,
      status: status ? status : '',
    });
  } catch (err) {
    res.json(OK, { message: err.message });
    console.log(err);
  }
};

/**
 * Contact Create route
 */

const create = async (req, res) => {
  // get data from request body
  const data = req.body;
  // company id
  const companyId = Request.GetCompanyId(req);

  try {
    // add field values to db
    let createData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile: data.mobile,
      work_phone: data.work_phone,
      object_name: data.object_name,
      status: Contact.STATUS_ACTIVE,
      company_id: companyId,
      designation: data.designation
    };

    if (Number.isNotNull(data.vendor_id) || Number.isNotNull(data.object_id) || Number.isNotNull(data.store_id)) {
      createData.object_id =  Number.isNotNull(data.vendor_id) ? data.vendor_id : Number.isNotNull(data.object_id) ? data?.object_id : Number.isNotNull(data.store_id) ? data.store_id : null
    }
 
    //create a contact
    const detail = await contact.create(createData);

    //create add system log
    History.create("Contact Added", req, ObjectName.CONTACT, detail?.id);
    // API response
    res.json(OK, { message: 'Contact Created' });
  } catch (err) {
    res.json(BAD_REQUEST, { message: err.message });
    // error handling
    console.log(err);
  }
};

/**
 * Contact get route
 */

const get = async (req, res) => {
  try {
  let companyId = Request.GetCompanyId(req);
  let id = req.params.id;

  if(!companyId){
    return res.json(400,{message:"CompanyId Not Found"})
  }

  if(!id){
    return res.json(400,{message:"Contact Id is Required"})
  }

  let getContactDetail = await contact.findOne({where:{id: id, company_id: companyId}});
  if(!getContactDetail){
    return res.json(400,{message:"Detail Not Found"})
  }

  let data={
    id: getContactDetail?.id,
    first_name: getContactDetail?.first_name,
    last_name: getContactDetail?.last_name,
    email: getContactDetail?.email,
    mobile: getContactDetail?.mobile,
    work_phone: getContactDetail?.work_phone,
    status: getContactDetail?.status,
    object_id: getContactDetail?.object_id,
    object_name: getContactDetail?.object_name,
    designation: getContactDetail?.designation,
  }
  res.json(200,{
    data
  })

  } catch (err) {
    console.log(err);
  }
};

/**
 * Contact update route
 */

const update = async (req, res) => {
  try {
    // recived data
    const data = req.body;
    // get company id
    const companyId = Request.GetCompanyId(req);

    // update contact data
    const updateData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile: data.mobile,
      work_phone: data.work_phone,
      status: data.status,
      ...(Number.isNotNull(data.object_name) ? {object_name: data.object_name} :{}),
      designation: data.designation
    };
    try {
      // Update Function
      const [id] = await contact.update(updateData, {
        where: {
          id: data.id,
          company_id: companyId,
        },
      });
      // create success system log
      History.create("Contact Updated", req, ObjectName.CONTACT, id);
      // API response
      res.json(Response.OK, { message: 'Contact Updated' });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
    // error finder
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

/**
 * Contact delete route
 */

const del = async (req, res, next) => {
  try {
    // recived data
    const id = req.params.id;
    // get company id
    const company_id = Request.GetCompanyId(req);
    // delete contact Function
    await contact.destroy({
      where: {
        id: id,
        company_id: company_id,
      },
    });
    // responce
    res.json(200, { message: 'Contact Deleted' });

    res.on('finish', async () => {
      // create system log for Status updation
      History.create("Contact Deleted", req, ObjectName.CONTACT, id);
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

const getContactById =async (objectId,objectName,companyId)=>{

  let where={}

  where.company_id = companyId

  if(objectId){
    where.object_id=objectId
  }

  if(objectName){
    where.object_name=objectName
  }

  let detail = await contact.findOne({where:where});
  return detail;
}

module.exports = {
  search,
  create,
  get,
  update,
  del,
  getContactById
};
