
const PageService = require("../../services/PageService");

// Models
const { Pages } = require("../../db").models;

const del = async (req, res) => {
    //validate permission exiist or not
  await PageService.delete(req,res)
    
}

module.exports = del;