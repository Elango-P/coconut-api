const AccountService = require("../../services/AccountService")


 async function get (req, res, next){
    try{
        
        AccountService .getDetail(req, res,next)
    }catch(err){
        console.log(err);
    }
};
module.exports = get;
