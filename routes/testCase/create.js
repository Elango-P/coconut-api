const TestCaseService = require("../../services/TestCaseService")


const create =async (req,res,next)=>{

    await TestCaseService.create(req,res,next)
}
module.exports = create;