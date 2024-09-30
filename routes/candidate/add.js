/* eslint-disable no-mixed-spaces-and-tabs */
const errors = require("restify-errors");

// Utils
const utils = require("../../lib/utils");
const Request = require("../../lib/request");
const Permission = require("../../helpers/Permission");
const MediaServices = require("../../services/media");


// Model
const { Candidate,Media: MediaModal} = require("../../db").models;

const { Media } = require("../../helpers/Media");
const ObjectName = require("../../helpers/ObjectName");
const statusService = require("../../services/StatusService");
const History = require("../../services/HistoryService");

function concatValue(from, to) {
  let detail = null;

  from = from ? parseInt(from, 10) : null;
  to = to ? parseInt(to, 10) : null;

  if (from && to) {
    detail = `${from}.${to}`;
  } else if (from) {
    detail = from;
  } else if (to) {
    detail = `0.${to}`;
  }

  return detail;
}
/**
 *  Get Overall Experience
 *
 * @param {*} from
 * @param {*} to
 */
async function add(req, res, next) {
  const hasPermission = await Permission.Has(Permission.CANDIDATE_ADD, req);

  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }

  const data = req.body;
  let fileDetail = req && req?.files && req?.files?.media_file;

  if (!data.firstName) {
    return res.json(400, { message: "First Name is required" });
  }

  if (!data.lastName) {
    return res.json(400, { message: "Last Name is required" });
  }


  const companyId = Request.GetCompanyId(req);
  const userId = Request.getUserId(req);
  
  try {
    const token = utils.md5Password(utils.getTimeStamp());

    const candidate = await Candidate.create({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      gender: data.gender,
      marital_status: data.maritalStatus,
      email: data.email,
      position: data.position,
      position_type: data.positionType,
      status: await statusService.getFirstStatus(ObjectName.CANDIDATE, companyId),
      owner_id: userId,
      company_id: companyId,
    });

    if (fileDetail) {
      let imageData = {
        file_name: fileDetail?.name.trim(),
        name: fileDetail?.name.trim(),
        company_id: companyId,
        object_id: candidate?.id,
        object_name: ObjectName.CANDIDATE,
        visibility: Media.VISIBILITY_PUBLIC,
      };
      let mediaDetails = await MediaModal.create(imageData);

      if (mediaDetails) {
        await MediaServices.uploadMedia(
          fileDetail?.path,
          mediaDetails?.id,
          fileDetail.name,
          mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false,
          true,
        );
      }
      await Candidate.update(
        { media_id: mediaDetails?.id },
        { where: { id: candidate?.id, company_id: companyId } }
      );
    }


    res.json(201, {
      message: " Candidate Added",
      candidateId: candidate.id,
    });

    res.on("finish", async () => {
      History.create("Candidate Added", req, ObjectName.CANDIDATE, candidate?.id);
    });
  } catch (err) {
    req.log.error(err);
    next(err);
  }
}

module.exports = add;
