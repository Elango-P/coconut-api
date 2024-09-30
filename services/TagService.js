const TagStatus = require("../helpers/TagStatus");
const Request = require("../lib/request");

const { Tag } = require('../db').models;

class TagService {
  static async getName(id, companyId) {
    let typeDetail = await Tag.findOne({
      where: {
        id: id,
        company_id: companyId,
      },
    });
    return typeDetail && typeDetail?.name;
  }


  static async list (params){
    let { type, companyId } = params;


  const where = {};

  where.company_id = companyId;
  where.status = TagStatus.ACTIVE;
  if (type) {
    where.type = type
  }

  const query = {
    order: [['name', 'ASC']],
    where,
  };

    const tagList = await Tag.findAndCountAll(query);

 
    const data = [];

    tagList.rows.forEach((tagDetail) => {
      const { id, name, type, default_amount } = tagDetail.get();
      data.push({
        id,
        name,
        default_amount,
        type
      });
    });

  return data;
  }
}

module.exports = TagService;
