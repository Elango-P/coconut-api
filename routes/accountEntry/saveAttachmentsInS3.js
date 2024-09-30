const fs = require("fs");

// Utils
const utils = require("../../lib/utils");

// S3
const s3 = require("../../lib/s3");

function saveAttachmentsInS3(accountEntryId, reqFiles) {
	return new Promise((resolve, reject) => {
		const files = reqFiles ? Object.keys(reqFiles) : [];
		if (files.length === 0) {
			return resolve([]);
		}

		const image = reqFiles.image;
		const imageType = utils.getExtensionByType(image.type);
		const mediaName = `account-entry-${accountEntryId}.${imageType}`;

		s3.uploadFile(image.path, `daybooks/account-entry/${accountEntryId}/${mediaName}`, (err) => {
			if (err) {
				return reject(err);
			}

			fs.unlink(image.path, () => {
				const basePath = `/daybooks/account-entry/${accountEntryId}`;
				const mediaData = files.map((key) => ({
					media_relative_url: `${basePath}/${reqFiles[key].name}`,
					filetype: reqFiles[key].type
				}));
				return resolve(mediaData);
			});
		});
	});
}

module.exports = saveAttachmentsInS3;
