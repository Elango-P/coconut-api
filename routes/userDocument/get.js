// S3
const s3 = require("../../lib/s3");

function get(req, res, next) {
	const imagePath = `media/user-document/${req.params.userId}/${req.params.mediaName}`;

	s3.getFile(imagePath)
		.on("error", (err) => {
			console.log(err, `There was an error getting image: ${imagePath}`);
			return next(err);
		})
		.pipe(res);
}

module.exports = get;
