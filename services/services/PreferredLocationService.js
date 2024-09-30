
const { PreferredLocation } = require("../../db").models;



class PreferredLocationService {

      static async getFirstRecord(companyId,userId){
        let where ={}
        where.company_id = companyId

        if(userId){
          where.user_id = userId
        }

        let getDetail = await PreferredLocation.findOne({
            where: where,
            order:[["preferred_order","ASC"]]
        });

        return getDetail;
      }
      
}
module.exports = PreferredLocationService;