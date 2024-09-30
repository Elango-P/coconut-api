
const { BAD_REQUEST } = require("../../helpers/Response");

const SlackService = require("../../services/SlackService");

const Request = require("../../lib/request");

async function get(req, res, next) {
    try {

        let companyId = Request.GetCompanyId(req);

       let channels = await SlackService.getChannel(companyId);
           
       return res.json(200, { channels })

    } catch (err) {
        console.log(err);
        //create a log for error
        res.json(BAD_REQUEST, { message: err.message, })
    }


};
module.exports = get;