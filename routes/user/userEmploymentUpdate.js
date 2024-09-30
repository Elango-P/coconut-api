const UserEmploymentService = require("../../services/UserEmploymentService");

/**
 *  update User Employment route
 */

async function updateUserEmployment(req, res, next) {
    try{
         UserEmploymentService.update(req, res, next)
    }
    catch(err){
        console.log(err);

    }
};


module.exports = updateUserEmployment;
