const TestCaseService = require("../../services/TestCaseService")


const del =async (req,res,next)=>{

    await TestCaseService.del(req,res,next)
}
module.exports = del;