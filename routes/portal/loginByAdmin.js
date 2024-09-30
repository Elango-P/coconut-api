//Service
// Common
const { getSQlCurrentDateTime } = require( "../../lib/utils");

const Response = require("../../helpers/Response");
const { getUserDetailById } = require("../../services/UserService");
const { getPortalFromRequest } = require("../../services/PortalService");

/**
 * After Login Success
 *
 * @param user
 * @param callback
 */
async function afterLoginSuccess(user, portalDetails, callback) {
    try {
        const { id, email, role, first_name, last_name, token, session_id } = user.get();
        const sessionId = token || Math.floor(Date.now());

        user.update({
            last_loggedin_at: getSQlCurrentDateTime(),
            token: sessionId,
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
                    portalName: portalDetails && portalDetails.portal_name,
                    portalUrl: portalDetails && portalDetails.portal_url,
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
            return res.status(400).send({ message: "Portal Id is required" });
        }
        let userId = req && req.user && req.user.id;

        //Get Portal Details
        let portalDetails = await getPortalFromRequest(req, id);

        if (!portalDetails) {
            return res.status(400).send({ message: "Portal Not Found" });
        }
        const userDetails = await getUserDetailById(userId);
        if (!userDetails) {
            return res.status(400).send({ message: "User Not Found" });
        }

        return afterLoginSuccess(
            userDetails,
            portalDetails,
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