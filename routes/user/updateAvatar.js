const errors = require("restify-errors");
const slug = require("slug");
const { Media } = require("../../helpers/Media");
const String = require("../../lib/string");
const { getMediaUrl } = require("../../lib/utils");
const MediaService = require("../../services/media");
const Request = require("../../lib/request");
const { User, Media: MediaModel } = require("../../db").models;

const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");

const mediaService = require("../../services/MediaService");
const UserService = require("../../services/UserService");

async function updateAvatar(req, res, next) {


  const data = req.params;

  const userId = data.userId
  const imageFile = req && req.files && req.files.file;
  const fileName = data.fileName


  const companyId = Request.GetCompanyId(req);

  if (!imageFile || !fileName) {
    return next(new errors.BadRequestError("Image is required"));
  }

  const userMediaDetail = await MediaModel.findOne({
    where: { object_id: userId, object_name: ObjectName.USER, company_id: companyId },
  });

  if (userMediaDetail) {
    try {

      const updataData = {
        name: String.replaceSpecialCharacter(fileName),
        file_name: String.replaceSpecialCharacter(fileName),
        object_id: userId,
        object_name: ObjectName.USER,
      };

      await MediaModel.update(

        updataData,
        {
          where: {
            id: userMediaDetail.id,
            company_id: companyId
          },
        }

      )
    } catch (err) {

    }

    await MediaService.uploadMedia(
      imageFile.path,
      userMediaDetail.id,
      String.replaceSpecialCharacter(fileName),
      true
    );
  }
  else {
    const imageData = {
      name: fileName,
      file_name: String.replaceSpecialCharacter(fileName),
      company_id: companyId,
      object_id: userId,
      object_name: ObjectName.USER,
      visibility: Media.VISIBILITY_PUBLIC
    };
    await MediaModel.create(imageData)
  }
  if (userMediaDetail) {
    try {
      let userMediaData = {
        media_id: userMediaDetail.id,
        company_id: companyId,
        media_url: await mediaService.getMediaURL(userMediaDetail.id, companyId) || null
      };

      await User.update(userMediaData,
        {
          where: {
            id: userId,
            company_id: companyId
          },
        });
      // Media Upload In S3
      await MediaService.uploadMedia(
        imageFile.path,
        userMediaDetail.id,
        userMediaDetail.file_name,
        true
      );
      //create a log for erro

      res.json(200, { message: "User Avatar Updated" });

      res.on("finish", async () => {
        History.create(`User Avatar Updated`, req, ObjectName.USER, userId);
          await UserService.reindex(userId,companyId)
        });
    } catch (err) {
    }
  }
}

module.exports = updateAvatar;
