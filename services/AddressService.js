const { Op } = require('sequelize');
const { BAD_REQUEST, CREATE_SUCCESS, OK } = require('../helpers/Response');
const DateTime = require('../lib/dateTime');
const Request = require('../lib/request');
const History = require('./HistoryService');

const { AddressModel } = require('../db').models;
const DataBaseService = require('../lib/dataBaseService');
const ObjectName = require('../helpers/ObjectName');
const Response = require('../helpers/Response');
const Account = require('../helpers/Account');
const Number = require("../lib/Number");
const addressService = new DataBaseService(AddressModel);

const create = async (req, res) => {
  try {
    const data = req.body;
    const companyId = Request.GetCompanyId(req);
    // Address data
    const createData = {
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      title: data.title,
      country: data.country,
      state: data.state,
      city: data.city,
      gst_number: data.gst_number,
      phone_number: data.phone_number,
      pin_code: data.pin_code,
      company_id: companyId,
      latitude: data?.latitude, 
      longitude: data?.longitude, 
    };

    if (data.vendor_id) {
      createData.object_id = data.vendor_id;
    } 
    else if(data.store_id){
      createData.object_id = data.store_id;
    }
    else {
      createData.object_id = companyId;
    }
    if (data.object_name == Account.CATEGORY_CUSTOMER) {
      createData.object_name = ObjectName.CUSTOMER;
    }else if(data.object_name == Account.CATEGORY_EMPLOYEE){
      createData.object_name = ObjectName.EMPLOYEE;

    }else if(data.object_name == Account.CATEGORY_VENDOR){
      createData.object_name = ObjectName.VENDOR;

    }

    else if(data.store_id){
      createData.object_name =ObjectName.LOCATION ;
    }
    else if(data.user_id){
      createData.object_name =ObjectName.USER ;
      createData.object_id = data.user_id ;


    }
    
    else {
      createData.object_name = ObjectName.COMPANY;
    }

    try {
      // Validate duplicate Address address1
      const statusExists = await addressService.findOne({
        where: {
          title: data.title ? data.title : '',
          company_id: data.vendor_id ? data.vendor_id : companyId,
        },
      });
      if (statusExists) {
        return res.json(Response.BAD_REQUEST, { message: 'Address Already Exist' });
      }

      // Create Address
      const address = await addressService.create(createData);

      // create a log
      History.create(
        "Address Created",
        req,
        data.vendor_id ? ObjectName.ACCOUNT : ObjectName.COMPANY,
        address.id
      );

      // API response
      res.json(OK, { message: 'Address Added' });
    } catch (err) {
      console.log(err);
      res.json(Response.BAD_REQUEST, { message: err.message });
    }
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const search = async (req, res) => {
  let {
    page,
    pageSize,
    search,
    sort,
    sortDir,
    pagination,
    object_id,
    objectName,
  } = req.query;

  // Validate if page is not a number
  page = page ? parseInt(page, 10) : 1;
  if (isNaN(page)) {
    return res.json(Response.BAD_REQUEST, { message: "Invalid page" });
  }

  // Validate if page size is not a number
  pageSize = pageSize ? parseInt(pageSize, 10) : 25;
  if (isNaN(pageSize)) {
    return res.json(Response.BAD_REQUEST, { message: 'Invalid page size' });
  }

  const companyId = Request.GetCompanyId(req);

  // Sortable Fields
  const validOrder = ['ASC', 'DESC'];
  const sortableFields = {
    id: 'id',
    address1: 'address1',
    address2: 'address2',
    gst_number: 'gst_number',
    title: 'title',
    pin_code: 'pin_code',
    name: 'name',
    createdAt: "createdAt"
  };

  const sortParam = sort || 'title';

  // Validate sortable fields is present in sort param
  if (!Object.keys(sortableFields).includes(sortParam)) {
    return res.json(Response.BAD_REQUEST, { message: `Unable to sort product by ${sortParam}` });
  }

  const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
  // Validate order is present in sortDir param
  if (!validOrder.includes(sortDirParam)) {
    return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
  }

  let where = {};
  where.company_id = companyId;

  if (Number.isNotNull(object_id)) {
    where.object_id = object_id;
  }

  if (objectName) {
    where.object_name = objectName;
  }

  // Search term
  const searchTerm = search ? search.trim() : null;
  if (searchTerm) {
    where[Op.or] = [
      {
        address1: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        address2: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        gst_number: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        title: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        city: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      {
        pin_code: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
    ];
  }

  const query = {
    order: [[[sortParam, sortDirParam]]],
    where,
  };

  if (pagination) {
    if (pageSize > 0) {
      query.limit = pageSize;
      query.offset = (page - 1) * pageSize;
    }
  }

  try {
    // Get Address list and count
    const addressList = await addressService.findAndCount(query);

    // Return Address is null
    if (addressList.count === 0) {
      return res.json({});
    }

    const data = [];
    addressList.rows.forEach((list) => {
      const {
        id,
        address1,
        address2,
        title,
        name,
        country,
        state,
        city,
        gst_number,
        phone_number,
        pin_code,
        createdAt,
        updatedAt,
        longitude,
        latitude,
      } = list.get();

      data.push({
        id,
        address1,
        address2,
        title,
        name,
        country,
        state,
        city,
        gst_number,
        phone_number,
        pin_code,
        createdAt: DateTime.defaultDateFormat(createdAt),
        updatedAt: DateTime.defaultDateFormat(updatedAt),
        latitude,
        longitude
      });
    });

    res.json(Response.OK, {
      totalCount: addressList.count,
      currentPage: page,
      pageSize,
      data,
      search,
      sort,
      sortDir,
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = req.body;
    const companyId = Request.GetCompanyId(req);

    // Validate address1
    if (!data.id) {
      return res.json(Response.BAD_REQUEST, { message: 'id is required' });
    }
    let historyMessage = [];

    const addressDetails = await addressService.findOne({
      where: {
        id: data.id,
        company_id: companyId,
      },
    });

    // Address data
    const updateData = {};

    if (
      data.address1 !== undefined &&
      data.address1 !== addressDetails.address1
    ) {
      updateData.address1 = data.address1 ? data.address1 : null;
      historyMessage.push(
        `Address1 Updated from ${addressDetails.address1} to ${data.address1}\n`
      );
    }

    if (
      data.address2 !== undefined &&
      data.address2 !== addressDetails.address2
    ) {
      updateData.address2 = data.address2 ? data.address2 : null;
      historyMessage.push(
        `Address2 Updated from ${addressDetails.address2} to ${data.address2}\n`
      );
    }

    if (data.title && data.title !== addressDetails.title) {
      updateData.title = data.title ? data.title : null;
      historyMessage.push(
        `Title Updated from ${addressDetails.title} to ${data.title}\n`
      );
    }

    if (data.name !== undefined && data.name !== addressDetails.name) {
      updateData.name = data.name ? data.name : "";
      historyMessage.push(
        `Name Updated from ${addressDetails.name} to ${data.name}\n`
      );
    }

    if (data.country !== undefined && data.country !== addressDetails.country) {
      updateData.country = data.country ? data.country : null;
      historyMessage.push(
        `Country Updated from ${addressDetails.country} to ${data.country}\n`
      );
    }

    if (data.city !== undefined && data.city !== addressDetails.city) {
      updateData.city = data.city ? data.city : null;
      historyMessage.push(
        `City Updated from ${addressDetails.city} to ${data.city}\n`
      );
    }

    if (data.state !== undefined && data.state !== addressDetails.state) {
      updateData.state = data.state ? data.state : null;
      historyMessage.push(
        `State Updated from ${addressDetails.state} to ${data.state}\n`
      );
    }

    if (
      data.gst_number !== undefined &&
      data.gst_number !== addressDetails.gst_number
    ) {
      updateData.gst_number = data.gst_number ? data.gst_number : null;
      historyMessage.push(
        `GST Updated from ${addressDetails.gst_number} to ${data.gst_number}\n`
      );
    }

    if (
      data.phone_number !== undefined &&
      data.phone_number !== addressDetails.phone_number
    ) {
      updateData.phone_number = data.phone_number ? data.phone_number : null;
      historyMessage.push(
        `Mobile Number Updated from ${addressDetails.phone_number} to ${data.phone_number}\n`
      );
    }

    if (
      data.pin_code !== undefined &&
      data.pin_code !== addressDetails.pin_code
    ) {
      updateData.pin_code = data.pin_code ? data.pin_code : null;
      historyMessage.push(
        `PinCode Updated from ${addressDetails.pin_code} to ${data.pin_code}\n`
      );
    }
    if (
      data?.latitude !== undefined &&
      data?.latitude !== addressDetails?.latitude
    ) {
      updateData.latitude = data.latitude ? data.latitude : null;
      historyMessage.push(
        `Latitude Updated from ${addressDetails.latitude} to ${data.latitude}\n`
      );
    }

    if (
      data?.longitude !== undefined &&
      data?.longitude !== addressDetails?.longitude
    ) {
      updateData.longitude = data.longitude ? data.longitude : null;
      historyMessage.push(
        `Longitude Updated from ${addressDetails.longitude} to ${data.longitude}\n`
      );
    }
    try {
      // Validate duplicate Address address1
      await addressService.update(updateData, {
        where: {
          id: data.id,
          company_id: companyId,
        },
      });

      if (historyMessage && historyMessage.length > 0) {
        let message = historyMessage.join();
        History.create(
          message,
          req,
          ObjectName.ACCOUNT,
          addressDetails?.object_id
        );
      } else {
        History.create(
          "Address Updated",
          req,
          ObjectName.ACCOUNT,
          addressDetails?.object_id
        );
      }
      // create a log

      // API response
      res.json(Response.OK, { message: 'Address Updated' });
    } catch (err) {
      res.json(Response.BAD_REQUEST, { message: err.message });
    }
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

// Get

const get = async (params, res) => {
  try {
    let {id, company_id,  object_id,  } = params

    if (!id && !object_id) {
      return res.json(400, { message: 'Invalid Id' });
    }

    let where={}
    if(id){
      where.id=id
    }

    where.company_id = company_id

    if(object_id){
      where.object_id = object_id
    }

    if(params?.object_name){
      where.object_name = params?.object_name
    }


    const detail = await addressService.findOne({
      where: where
    });
    
    let data = {
      id: detail?.id,
      address1: detail?.address1,
      address2: detail?.address2,
      title: detail?.title,
      name: detail?.name,
      country: detail?.country,
      state: detail?.state,
      city: detail?.city,
      pin_code: detail?.pin_code,
      gst_number: detail?.gst_number,
      object_name: detail?.object_name,
      latitude:detail?.latitude,
      longitude:detail?.longitude,
      phone_number: detail?.phone_number
    };

    return data;
  } catch (err) {
    console.log(err);
  }
};

const del = async (req, res, next) => {
  try {
    const addressId = req.params.id;

    const company_id = Request.GetCompanyId(req);
    await addressService.delete({
      where: {
        id: addressId,
        company_id: company_id,
      },
    });

    res.json(Response.DELETE_SUCCESS, { message: 'Address Deleted' });

    res.on('finish', async () => {
      // create system log for Address updation
      History.create("Address Deleted", req);
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

const Get = async (object,object_id,companyId) => {
  try {

      let where = new Object();

      where.company_id = companyId;

      where.object_name = object;

      where.object_id = object_id;


      const addressDetail = await addressService.findOne({ where: where });

      return addressDetail;
  } catch (err) {
      console.log(err);
  }
}
const list = async (params) => {

  const {companyId,objectName} = params;

  let where = {};
  where.company_id = companyId;
  if(objectName){
  where.object_name = objectName;

  }

  const query = {
    where,
    order:[["title","ASC"]]
  };

  try {
    // Get Address list and count
    const addressList = await addressService.findAndCount(query);

    const data = [];
    addressList.rows.forEach((list) => {
      const {
        id,
        name,
        title
      } = list.get();

      data.push({
        id,
        name,
        title
      });
    });

    return data

   
  } catch (err) {
     console.log(err);
  }
};


module.exports = {
  create,
  search,
  update,
  del,
  get,
  list,
  Get
};
