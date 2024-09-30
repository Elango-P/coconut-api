// Status
const { BAD_REQUEST }  = require("../../helpers/Response");

// Services
const CustomerService = require("../../services/CustomerService");

 async function search(req, res, next){

    const params = req.query;

    try {
        const data = await CustomerService.searchOrder(params,req);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {
            message: err.message 
       });
    }
};
module.exports = search;