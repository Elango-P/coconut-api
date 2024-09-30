const User = require("../../helpers/User");
const DataBaseService = require("../../lib/dataBaseService");
const Request = require("../../lib/request");

const { StoreUser } = require("../../db").models;

let StoreUserModel = new DataBaseService(StoreUser);

const userLocationGetRoute = async (req, res, next) => {
  let params = req.params;
  let companyId = Request.GetCompanyId(req);

  let userLocationList = await StoreUserModel.find({
    where: {
      user_id: params?.id,
      company_id: companyId,
    },
  });
  let primaryValue = {};
  let secondaryValue = {};
  if (userLocationList && userLocationList.length > 0) {
    for (let i = 0; i < userLocationList.length; i++) {
      const { store_id, shift_id, type } = userLocationList[i];

      if (type == User.PRIMARY_TYPE) {
        (primaryValue.primary_location = store_id), (primaryValue.primary_shift = shift_id);
      }
      if (type == User.SECONDARY_TYPE) {
        (secondaryValue.secondary_location = store_id), (secondaryValue.secondary_shift = shift_id);
      }
    }
  }

  res.json(200, { data: { ...primaryValue, ...secondaryValue } });
};
module.exports = userLocationGetRoute;
