const TestCaseService = require("../../services/TestCaseService")


const update =async (req,res,next)=>{

    await TestCaseService.update(req,res,next)
}
module.exports = update;