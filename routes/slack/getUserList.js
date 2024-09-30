
const { BAD_REQUEST } = require("../../helpers/Response");
const SlackService = require("../../services/SlackService");
const Request = require("../../lib/request");


async function getUserList(req, res, next) {
    try {
        let companyId = Request.GetCompanyId(req);

        let userList = await SlackService.getSlackUserList(companyId);

        let activeUserList = new Array();

        if (userList && userList.length > 0) {
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].deleted == false) {
                    activeUserList.push(userList[i]);
                }
            }
        }

        return res.json(200, { userList: activeUserList })

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};
module.exports = getUserList;