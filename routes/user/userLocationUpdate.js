const DataBaseService = require('../../lib/dataBaseService');
const Request = require('../../lib/request');

const { StoreUser } = require('../../db').models;

let StoreUserModel = new DataBaseService(StoreUser);

const userLocationUpdate = async (req, res, next) => {
  let { id } = req.params;
  let data = req.body;
  let companyId = Request.GetCompanyId(req);
  let update;
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    let userLocationExists = await StoreUserModel.findOne({
      where: {
        user_id: id,
        type: value?.type,
        company_id: companyId,
      },
    });
    let updateData = {
      store_id: value?.primary_location ? value?.primary_location : value?.secondary_location ? value?.secondary_location : null,
      user_id: id,
      shift_id: value?.primary_shift ? value?.primary_shift : value?.secondary_shift ? value?.secondary_shift : null,
      type: value?.type,
      company_id: companyId,
    };

    if (userLocationExists) {
      update = await userLocationExists.update(updateData);
    } else {
      await StoreUserModel.create(updateData);
    }
  }

  res.json(200, { message: `User Location ${update ? 'Updated' : 'Create'} Succssfully` });
};
module.exports = userLocationUpdate;
