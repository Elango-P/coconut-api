
const UserEmploymentService = require("../../services/UserEmploymentService");


async function createUserEmployee(req, res, next) {
 
    try{
         UserEmploymentService.add(req, res, next)
    }
    catch(err){
        console.log(err);

    }
}

module.exports = createUserEmployee;