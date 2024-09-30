const { UserSalary } = require("../../db").models;
const Request = require("../../lib/request");


async function get(req, res, next) {
    const {
        id
    } = req.params;
    try {
        const company_id = Request.GetCompanyId(req);

        if (!id) {
            return res.json(400, {
                message: "Invalid Id"
            });
        }

        const userSalaryData = await UserSalary.findOne({
            where: {
                id: id,
                company_id: company_id,
            },
        });

        if (!userSalaryData) return res.json(200, {
            message: "No Records Found"
        });

        res.json(200, {data:userSalaryData});
    } catch (err) {
        next(err);
        console.log(err);
    }
}
module.exports = get;