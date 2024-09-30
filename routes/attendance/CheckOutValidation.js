
const Request = require("../../lib/request");
const ValidationService = require("../../services/ValidationService");

const CheckOutValidation = async (req, res,next) => {
    const { id } = req.params;
    const companyId = Request.GetCompanyId(req);
    const roleId = Request.getUserRole(req);

    const userId = Request.getUserId(req);

    try {
        if (id) {
            await ValidationService.attendanceCheckOut(id,companyId, roleId, userId,res);
        }
        res.json(200, { message: "Validation successfull" });
        // If all checks pass, send a success response
    } catch (err) {
        console.log(err);
        // If an error occurs, send the error message with a 400 response
        res.json(400, { message: err.message });
    }
};

module.exports = CheckOutValidation;
