const TestCaseService = require("../../services/TestCaseService")


const search =async (req,res,next)=>{

    await TestCaseService.search(req,res,next)
}
module.exports = search;