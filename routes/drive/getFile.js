const s3 = require("../../lib/s3");

function getFile(req, res, next) {
	const filePath = `media/drives/${req.params.fileName}`;

	s3.getFile(filePath)
		.on("error", (err) => {
			console.log(err, `There was an error getting image: ${filePath}`);
			return next(err);
		})
		.pipe(res);
}

module.exports = getFile;
