const async = require("async");
const path = require("path");

// Models
const { Screenshot } = require("../../db").models;

// S3
const s3 = require("../../lib/s3");

function deleteScreenshot(id, callback) {
	Screenshot
		.findOne({
			attributes: ["id", "image"],
			where: { id }
		})
		.then((screenshot) => {
			if (!screenshot) {
				return callback(new Error("Screenshot not found"));
			}

			const { image } = screenshot.get();

			const extension = path.extname(image);
			const thumbnail = `${path.basename(image, extension)}-thumb${extension}`;

			screenshot
				.destroy()
				.then(() => s3.delFile(`media/screenshot/${image}`, () => s3.delFile(`media/screenshot/${thumbnail}`, () => callback())));
		});
}

function bulkDelete(req, res) {
	const ids = req.body.ids.split(",");
	async
		.eachSeries(ids, (id, cb) => deleteScreenshot(id, () => cb()), () => {
			res.json({ message: "Screenshot(s) deleted" });
		});
}

module.exports = bulkDelete;
