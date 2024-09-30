// Process Page
const processPage = require("./processPage");

// Models
const { WikiPage } = require("../../db").models;

async function del(req, res) {
	try {
		const id = req.params.id;

		// To Get Page By ID
		const pageDetails = await WikiPage
			.findOne({
				where: { id }
			});

		if (pageDetails) {
			res.json(processPage(pageDetails));
		}
	} catch (err) {
		console.log(err);
	}
}

module.exports = del;
