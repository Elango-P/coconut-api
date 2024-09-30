const response = require("../../helpers/Response");
const forgotPasswordEmailService = require("../../services/forgotPasswordEmailService");
async function forgotPassword  (req, res, next) {
    try {  
    let { email } = req.body;
    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }
    email = email.toLowerCase().trim();
    
        //Forgot Password Email Service
        await forgotPasswordEmailService.sendEmail(
            req,
            email,
            err => {
                if (err) {
                    return res.json(response.BAD_REQUEST, { message: err });
                } else {
                    return res.json(response.OK, { message: "Email Sent "});
                }
            }
        );
        
    } catch (error) {
        return res.json(response.BAD_REQUEST, { message: "Error" });
    }
    
};
module.exports = forgotPassword;