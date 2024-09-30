
const { BillService } = require("../../services/services/billService");

async function get(req, res, next) {
    try {
        BillService.get(req, res, next);
    } catch (err) {
        console.log(err);
        res.json(400, { message: err.message })
    }
}

module.exports = get;
