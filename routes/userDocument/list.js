// Utils
const utils = require("../../lib/utils");

// Models
const { UserDocument } = require("../../db").models;

// eslint-disable-next-line no-unused-vars
function list(req, res, next) {
  const id = req.params.userId;

  UserDocument.findAll({
    attributes: [
      "id",
      "user_id",
      "document_type",
      "document_url",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [["createdAt"]],
    where: { user_id: id },
  }).then((userDocument) => {
    const userDocumentList = [];
    userDocument.forEach((userdocument) => {
      userdocument = userdocument.get();

      userDocumentList.push({
        id: userdocument.id,
        userId: userdocument.user_id,
        mediaName: userdocument.media_name,
        mediaUrl: `${userdocument.user_id}/${userdocument.document_url}`,
        mediaAttachmentUrl: utils.getUserDocumenttUrl(
          userdocument.user_id,
          userdocument.document_url
        ),
        documentType: userdocument.document_type,
        documentUrl: userdocument.document_url,
        status: userdocument.status,
        statusText: userdocument.status === "1" ? "Active" : "InActive",
        Createat: utils.formatDate(userdocument.createdAt),
        documentCreateat: utils.formatDate(userdocument.createdAt, "DD MMM, Y"),
      });
    });

    res.json(userDocumentList);
  });
}

module.exports = list;
