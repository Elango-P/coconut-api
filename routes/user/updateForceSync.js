const { userService } = require("../../services/UserService");
//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const UserService = require("../../services/UserService");

async function updateForceSync(req, res, next) {
    try {
        const data = req.body;

        const { id } = req.params;

        let companyId = Request.GetCompanyId(req);

        if(!id){
           return res.send(400, { message: "User Id Is Required" });
        }

        await userService.update({ force_sync: data.forceSync }, {
                where: { id: id, company_id: companyId },
                returning: true,
                plain: true,
            })

        //create log for error

        res.send(200, { message: "User Updated" });
        res.on("finish", async () => {
            History.create(`User Force Sync Updated`, req, ObjectName.USER, id);
              await UserService.reindex(id,companyId)
            });

    } catch (err) {
        res.send(400, { message: err.message });

        console.log(err);
    }
}

module.exports = updateForceSync;
