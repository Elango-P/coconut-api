const PageService = require("../../services/PageService");

// Pages Update route
async function update(req, res) {
    await PageService.update(req,res)
};

module.exports = update;