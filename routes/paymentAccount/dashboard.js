const { Account, AccountEntry,PaymentAccount } = require("../../db").models;
const Request = require("../../lib/request");

async function dashboard(req, res) {
    const companyId = Request.GetCompanyId(req)
    try {
        const getAccount = await PaymentAccount.count({ where: { company_id: companyId } });
        const getAccountEntry = await AccountEntry.count({ where: { company_id: companyId } });

        return res.json({
            accountCount: getAccount,
            accountEntryCount: getAccountEntry
        });
    } catch (err) {
        console.log(err);
    }
}
module.exports = dashboard;