const base64 = require("node-base64-image");
const fs = require("fs");

// Make Media Directory
const mediaDir = "./media";
if (!fs.existsSync(mediaDir)) {
	fs.mkdir(mediaDir);
}

// Make users Image Directory
const userImageDir = `${mediaDir}/user`;
if (!fs.existsSync(userImageDir)) {
	fs.mkdir(userImageDir);
}

module.exports = {
	// Upload users Profile Picture
	userProfilePhotoUpload: (data, id) => {

		const imageName = "profile_photo_" + `${id}`;
		const options = { filename: `${userImageDir}` + "/" + `${imageName}` };

		const dataArray = data.split("base64,");
		const imageData = new Buffer(dataArray[1], "base64");

		base64.decode(imageData, options, (err) => {
			if (err) {
				console.log(err);
			}
		});

		return "/media/user/" + `${imageName}` + ".jpg";
	}
};
