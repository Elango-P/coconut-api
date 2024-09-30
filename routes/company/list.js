// import service
const { defaultDateFormat } = require("../../lib/utils");
const { companyService } = require("../../services/CompanyService");


async function list(req, res, next) {

      
  let where={}
  if(req.query.url){
    where.portal_url = req.query.url
  }
  try {
    const query = {
      where,
      order: [["company_name", "ASC"]],
    };
  
    let data = [];
    const companyDetail = await companyService.findAndCount(query);
    companyDetail.rows.forEach((value) => {
      data.push({
        id: value.id,
        company_name: value.company_name,
        mobile_number: value.mobile_number1,
        portal_url: value.portal_url,
        template: value.template,
        status: value.status ? value.status : "",
        createdAt: defaultDateFormat(value.createdAt),
        updatedAt: defaultDateFormat(value.updatedAt),
      });
    });

    res.send({
      data,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
}

module.exports = list;
