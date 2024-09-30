// S3
const s3 = require("../../lib/s3");

function get(req, res, next) {
	const imagePath = `media/screenshot/${req.params.mediaName}`;

	s3.getFile(imagePath)
		.on("error", (err) => next(err))
		.pipe(res);
}

module.exports = get;
