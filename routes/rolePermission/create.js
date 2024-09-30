// import service
const {
    rolePermissionService,
    isNameExist,
} = require("../../services/RolePermissionService");

const Request = require("../../lib/request");
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");

async function create(req, res, next) {
    try {
        const data = req.body;

        let companyId = Request.GetCompanyId(req);

        //Validation
        const isNameExists = await isNameExist(data.name);
        if (isNameExists) {
            return res.send(400, { message: "Permission already exist" });
        }

        // Create Permission Data
        const createData = {
            name: data && data.name,
            company_id: companyId,
        };

        try {
            const data = await rolePermissionService.create(createData);
            res.on('finish', async () => {
                //create system log for product updation
                History.create('Permission Created', req, ObjectName.PERMISSION, data?.id);
            });
            res.send(201, {
                message: "Permission Created",
            });
        } catch (err) {
            History.create(`Permission Creation err-`, req, ObjectName.PERMISSION);
            res.send(400, err);
            next(err);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = create;