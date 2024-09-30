const s3 = require("../../lib/s3");

const mime = require("mime-types");

const { BAD_REQUEST, OK } = require("../../helpers/Response");

function getAvatar(req, res, next) {
	const imagePath = `candidate/avatar/${req.params.mediaName}`;

	s3.getFile(imagePath, (err, data) => {

		if (err) {
			return res.json(BAD_REQUEST, { message: err });
		}

		// Validate if data is null
		if (!data) {
			return res
				.json(BAD_REQUEST), { message: "File not found" };
		}

		res.writeHead(OK, {
			"Content-Type": mime.lookup(imagePath),
		});

		res.write(data.Body, "binary");

		res.end();
	})
}

module.exports = getAvatar;
