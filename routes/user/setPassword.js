const Response = require("../../helpers/Response");
const utils = require("../../lib/utils");
const { User } = require("../../db").models;
function setPassword (req, res, next) {
    const token = req.query.token;
    const { password, confirmPassword } = req.body;

    // Validate if password is null
    if (!password) {
        return res.status(400).send({ message: "Password is required" });
    }
    // Validate if confirm Password is null
    if (!confirmPassword) {
        return res
            .status(400)
            .send({ message: "Confirm password: is required" });
    }
    // Validate if Password and confirm Password did match
    if (password && confirmPassword && password !== confirmPassword) {
        return res
            .status(400)
            .send({ message: "Confirm password did not match" });
    }
    // Validate if token is null
    if (!token) {
        return res.status(400).send({ message: "Invalid session" });
    }
    User.findOne({
        attributes: ["id", "role", "token", "company_id"],
        where: { token: token },
    }).then(isUserExists => {
        if (!isUserExists) {
            return res.json(Response.BAD_REQUEST, { message: "Token Expired "});
        }
            // Update the password
            User.update(
                {
                    password: utils.md5Password(password),    
                },
                { where: { id: isUserExists.id } }
            ).then(() => {
                res.json(Response.OK,{ message: "Password updated" , token: isUserExists.token,
                role: isUserExists.role,
                userId: isUserExists.id });
            });
        
    });
};
module.exports = setPassword;
