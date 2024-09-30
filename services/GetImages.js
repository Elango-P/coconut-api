// S3
const s3 = require("../lib/s3");

const GetScreenshots = (module.exports = {
  getImages: (mediaName, callback) => {
    const imagePath = `media/ticket/${mediaName}`;
    s3.getFileDetail(imagePath, (err, data) => {
      if (err) {
        return callback(err);
      }
      callback(data);
    });
  },
});
