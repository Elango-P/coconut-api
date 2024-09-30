const ObjectName = require("../../helpers/ObjectName");
const Response = require("../../helpers/Response");
const History = require("../../services/HistoryService");
const { AccountEntry, status: statusModel } = require("../../db").models;


const statusUpdate = async (req, res, next) => {
    let companyId = Request.GetCompanyId(req);

    let data = req.body;
    let { id } = req.params;
    let company_id = Request.GetCompanyId(req);

    const AccountEntryStatus = await AccountEntry.findOne({ where: { company_id: companyId, id: id } });

    const { status } = AccountEntryStatus;

    const statusValue = await statusModel.findOne({ where: { company_id: company_id, id: status } });


    try {
        if (!id) {
            return res.json(Response.BAD_REQUEST, {
                message: 'Invalid Id',
            });
        }

        let updateData = {};
        if (data.status) updateData.status = data.status;

        await AccountEntry.update(updateData, {
            where: {
                id,
                company_id,
            },
        });
        const statusData = await statusModel.findOne({ where: { company_id: company_id, id: data.status } });

        // systemLog
        res.json(Response.OK, {
            message: 'Account Entry Status Updated',
        });
        res.on('finish', async () => {
            History.create(
                `Account Entry Status Changed From ${statusValue.name} to ${statusData.name} `,
                req,
                ObjectName.PURCHASE_ORDER,
                id
            );
        });
    } catch (err) {
        next(err);
        console.log(err);
        res.json(Response.BAD_REQUEST, {
            message: err.message,
        });
    }
};

module.exports = statusUpdate;