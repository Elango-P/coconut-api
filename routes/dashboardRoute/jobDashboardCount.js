const { Jobs } = require("../../db").models;

async function jobDashboardCount(req, res) {
    const company_id = req.user && req.user.company_id;
    if (company_id) companyWhere = { company_id };

    try {

        let jobCount = await Jobs.count({
            where: { company_id },
        });

        res.send({
            jobCount: jobCount
        });
    } catch (err) {
        console.log(err);
        (err) => res.status(400).send({ message: err.message });
    }
}
module.exports = jobDashboardCount;
