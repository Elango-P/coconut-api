const Request = require("../../lib/request");

const MediaService = require("../../services/MediaService");

async function createMedia(req, res, next) {

  const History = require("../../services/HistoryService");

  try {

    let companyId = Request.GetCompanyId(req);

    let mediaUrl;

    //get media file from request
    const uploadFileData = req && req.files && req.files.media_file;

    let mediaDetails = await MediaService.create(req.body, uploadFileData, companyId);

    if (mediaDetails) {
      mediaUrl = await MediaService.getMediaURL(mediaDetails.id, companyId);
    }

    //send response to front end
    res.json(200, { message: "Media Added", id: mediaDetails && mediaDetails.id, mediaUrl: mediaUrl });

    res.on("finish", async () => {
      History.create("Media Added", req, req.body.object, req.body.object_id);
    });

  } catch (err) {
    //send response to front end
    console.log(err);
    res.json(400, { message: err.message });
  }
}

module.exports = createMedia;
