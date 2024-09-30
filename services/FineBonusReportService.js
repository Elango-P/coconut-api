const { Op, Sequelize } = require("sequelize");
const { User, FineBonus, Tag } = require("../db").models;
const statusService = require("./StatusService");
const BooleanLib = require("../lib/Boolean");
const validator = require("../lib/validator");
const Number = require("../lib/Number");
const Permission = require("../helpers/Permission");
const ObjectName = require("../helpers/ObjectName");
const ArrayList = require("../lib/ArrayList");
const { fineService } = require("./FineBonusService");
const Status = require("../helpers/Status");
const ObjectHelper = require("../helpers/ObjectHelper");

// Define the search function for fines
const search = async (params, companyId, req) => {
  try {
    let {
      page,
      pageSize,
      search,
      sort,
      sortDir,
      pagination,
      status,
      group,
      user,
      type,
      startDate,
      endDate,
      showTotal
    } = params;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      throw { message: 'Invalid page' };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      throw { message: 'Invalid page size' };
    }

    if (!companyId) {
      throw { message: 'Company Not Found' };
    }

    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      id: 'id',
      date: 'date',
      type: 'type',
      user: 'user',
      reviewer: 'reviewer',
      amount: 'amount',
      status: 'status',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    const sortParam = sort || 'updatedAt';

    // Validate sortable fields are present in the sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      throw { message: `Unable to sort FineBonus by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      throw { message: 'Invalid sort order' };
    }

    const where = {};
    const statusWhere = {};
    
    const hasFineManageOthersPermission = await Permission.Has(
      Permission.FINE_MANAGE_OTHERS,
      req
    );

    if (!hasFineManageOthersPermission) {
      let userId = req && req.user && req.user.id;
      where.user = userId; // Update to use the correct association
    }

    let allowToViewIds = await statusService.GetAllowToViewStatusIds(
      ObjectName.FINE,
      companyId
    );

    if (user) {
      where.user = user; 
    }

    if (type) {
      where.type = type;
    }
    if(status){
      where.status = status
    }else{
      let statusData = await statusService.getAllStatusByGroupId(ObjectName.FINE, Status.GROUP_COMPLETED, companyId);
      let statusIds = statusData && statusData.length > 0 && statusData.map((data)=> data?.id)
      where.status = {[Op.in]:statusIds}
    }
   
  

    if (group) {
      statusWhere.group = group;
    }

    if (allowToViewIds && allowToViewIds.length > 0) {
      if (!hasFineManageOthersPermission) {
        where.status = { [Op.in]: allowToViewIds };
      }
    } else {
      where.status = null;
    }

    where.company_id = companyId;

    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          "$userDetails.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          "$userDetails.last_name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          [Op.and]: [
            Sequelize.literal(
              `CONCAT("userDetails"."name", "userDetails"."last_name" ) iLIKE '%${searchTerm}%'`
            ),
          ],
        },
      ];
    }

    if (startDate && !endDate) {
      where.date = {
        [Op.gte]: startDate,
      };
    }

    if (endDate && !startDate) {
      where.date = {
        [Op.lte]: endDate,
      };
    }

    if (startDate && endDate) {
      where.date = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    let order = [];

    if (sort == "user") {
      order.push(["userDetails","name",sortDirParam])
    } else if(sort == "amount") {
      order.push(["totalAmount", sortDirParam])
    }else {
      order.push([sortParam, sortDirParam])
    }

    const query = {
      attributes: [
        'user',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
      ],
      where,
      include: [
        {
          model: User,
          as: 'userDetails',
        },
      ],
      group: ['user', 'userDetails.id'],
      order: order,
    };

    const totalAmountQuery = {
      include: [
        {
          model: User,
          as: 'userDetails',
        },
      ],
      where,
    };

    if (validator.isEmpty(pagination)) {
      pagination = true;
    }
    
    if (BooleanLib.isTrue(pagination)) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }


    let param={
      company_id: companyId,
      user: hasFineManageOthersPermission ? Number.isNotNull(user) ? user : null : req.user.id ,
      type: Number.isNotNull(type) ? type : null,
      status: (!hasFineManageOthersPermission && allowToViewIds && allowToViewIds.length > 0) ? Number.isNotNull(status) ? [status] : allowToViewIds  : Number.isNotNull(status) ? [status] :null,
      startDate:  startDate,
      endDate:  endDate,
      searchTerm,
    }

    let totalAmount = 0;
    let totalFineAmount = await FineBonus.findAndCountAll(totalAmountQuery);

    totalFineAmount.rows.forEach((value) => {
      totalAmount += Number.Get(value.get("amount"));
    });


    const data = [];

    // Get FineBonus list and count
    const fines = await FineBonus.findAndCountAll(query);
    // Return FineBonus list if it's null
    if (fines.count === 0) {
      throw { message: 'FineBonus not found' };
    }

    let fineList = fines && fines?.rows;

    if(ArrayList.isArray(fineList)){
      for (let i = 0; i < fineList.length; i++) {
        const values = fineList[i];

        data.push({
          amount: values?.dataValues?.totalAmount,
          first_name: values?.userDetails?.name,
          last_name: values?.userDetails?.last_name,
          media_url: values?.userDetails?.media_url,
        })
      }
    }

    if(showTotal){
      let lastReCord = ObjectHelper.createEmptyRecord(data[0]) 
      lastReCord.amount = totalAmount || "";
      data .push(lastReCord);
    }

    return {
      totalCount: fines && fines.count && fines.count.length,
      currentPage: page,
      pageSize,
      data: data,
      search,
      sort,
      sortDir,
      totalAmount,
    };
  } catch (err) {
    console.log(err);
    throw { message: err.message };
  }
};

module.exports = { search };
