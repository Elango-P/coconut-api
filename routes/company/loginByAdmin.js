//Service
// Common
const { getSQlCurrentDateTime } = require( "../../lib/utils");

const Response = require("../../helpers/Response");
const { getUserDetailById } = require("../../services/UserService");
const { getPortalFromRequest } = require("../../services/PortalService");
const { getCompanyDetailById } = require("../../services/CompanyService");

//systemLog
const History = require("../../services/HistoryService");
/**
 * After Login Success
 *
 * @param user
 * @param callback
 */
async function afterLoginSuccess(user, companyDetail,req, callback) {
    try {
        const { id, email, role, first_name, last_name, token, session_id } = user.get();
        const sessionId = token || Math.floor(Date.now());

        user.update({
            last_loggedin_at: getSQlCurrentDateTime(),
            token: sessionId,
            company_id: companyDetail.id
        })
            .then(() => {
                callback(null, Response.OK, {
                    message: "User LoggedIn SuccessFully",
                    token: session_id,
                    userId: id,
                    role: role,
                    firstName: first_name,
                    lastName: last_name,
                    email,
                    companyId: companyDetail && companyDetail.id,
                    companyName: companyDetail && companyDetail.portal_name,
                    portalUrl: companyDetail && companyDetail.portal_url,
                });
            })
            .catch((err) => callback(err));
    } catch (err) {
        console.log(err);
    }
}

async function loginByAdmin (req, res) {
    try {
        let { id } = req.params;
        if (!id) {
            return res.send(400, { message: "Company Id is required" });
        }
        let userId = req && req.user && req.user.id;

        //Get Portal Details
        let companyDetail = await getCompanyDetailById(id);

        if (!companyDetail) {
            return res.send(404,{ message: "Company Not Found" });
        }
        const userDetails = await getUserDetailById(userId);
        if (!userDetails) {
            return res.send(404, { message: "User Not Found" });
        }

        return afterLoginSuccess(
            userDetails,
            companyDetail,
            req,
            (err, status, result) => {
                if (err) {
                    return res
                        .status(status || Response.BAD_REQUEST)
                        .send({ message: err.message });
                }
                return res.json(result);
            }
        );
    } catch (err) {
        console.log(err);
    }
};

module.exports = loginByAdmin