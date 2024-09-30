const { History: historyModal } = require("../db").models;

class History {
  async create(message, req, object, objectId, systemUser) {
    try {
      if (!message) return;
      
      const createData = {};

      createData.message = message;

      if (req && req?.user && req?.user?.id) {
        createData.user_id = req.user.id;
      } else {
        if (systemUser) {
          createData.user_id = systemUser;
        }
      }

      createData.company_id = req ? req.user ? req.user.company_id : req.query ? req.query.companyId : null : null;

      if (object) {
        createData.object_name = object;
      }

      if (objectId) {
        createData.object_id = objectId ;
      }

      await historyModal.create(createData);
    } catch (err) {
      console.log(err);
    }
  }
}

const history = new History();

module.exports = history;
