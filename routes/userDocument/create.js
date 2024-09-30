const fs = require("fs");

// S3
const s3 = require("../../lib/s3");

// Utils
const utils = require("../../lib/utils");

// Models
const { UserDocument } = require("../../db").models;

function create(req, res, next) {
	const data = req.body;
	const image = req.files.image;

	UserDocument
		.create({
			status: data.status || 1,
			document_type: data.documentType,
			user_id: data.userId,
		})
		.then((userDocument) => {
			const imageType = image.type.split(";")[0].split("/")[1];

			data.documentType = utils.ucFirst(data.documentType);

			const mediaName = `${userDocument.id}-${data.documentType}.${imageType}`;
			UserDocument.update({ document_url: mediaName },{ where: { id: userdocument.id } })
			.then(() => {
				s3.uploadFile(image.path, `media/user-document/${data.userId}/${mediaName}`, (err) => {
					if (err) {
						return res.status(400).send(err);
					}

					fs.unlink(image.path, () => {
						res.json(201, {
							message: "User Document added"
						});
					});
				});
			});
		})
		.catch((err) => {
			req.log.error(err);
			return next(err);
		});
}

module.exports = create;
