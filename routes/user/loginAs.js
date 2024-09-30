const { userService ,getUserDetailById} = require("../../services/UserService");
;
const { getSQlCurrentDateTime } = require( "../../lib/utils");
const utils = require("../../lib/utils");
const { OK } = require("../../helpers/Response");
const Request = require("../../lib/request");


async function afterLoginSuccess(user, callback) {
    const { id, email, role, name, last_name, token } = user.get();
    const session_id = token || Math.floor(Date.now());
    userService
        .update(
            {
                last_loggedin_at: utils.getSQlCurrentDateTime(),
                token: session_id,
                session_id:session_id,
            },
            { where: { id } }
        ).then(() => {

            
            return callback(null, OK, {
                message: "User LoggedIn SuccessFully",
                token: session_id,
                userId: id,
                role: role,
                firstName: name,
                lastName: last_name,
                email,
            });
        })
        .catch(err => callback(err));
    
}
async function loginAs(req, res, next) {
          let { id } = req.params;
        if (!id) {
            return res.send(404, { message: 'User Id is required' });
        }
        const companyId = Request.GetCompanyId(req);
        // Get User Email by Id
        const userDetails = await getUserDetailById(id,companyId);
       
        if (!userDetails) {
            return res.send(404, { message: 'userDetails not found' });
        }
       
        return afterLoginSuccess(userDetails, (err, status, result) => {
            return res.json(result);
        });
    };
  
  module.exports = loginAs;