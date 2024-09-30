/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST } = require('../../helpers/Response');

// Models
const { Media: MediaModel, SchedulerJob } = require('../../db').models;

// Lib
const Request = require('../../lib/request');

const { Media } = require('../../helpers/Media');

const S3 = require('../../lib/s3');

const History = require('../../services/HistoryService');
const schedulerJobCompanyService = require('../scheduler/schedularEndAt');

/**
 * orderProduct create route
 */
async function updateS3Image(req, res, next) {
  try {
    const companyId = Request.GetCompanyId(req);

    let id = req.query.id;

    let params = { companyId: companyId, id: id };

    res.json(200, { message: 'Media Updation Started' });

    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

    History.create(`${schedularData?.name} Media S3 Image ACH Updation Job Started`, req);

    res.on('finish', async () => {
      schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      let mediaList = await MediaModel.findAll({
        where: { company_id: companyId },
      });

      if (mediaList && mediaList.length > 0) {
        for (let i = 0; i < mediaList.length; i++) {
          const { file_name, id, visibility } = mediaList[i];

          let filePath = `${id}-${file_name}`;

          await S3.UpdateACH(filePath, visibility == Media.VISIBILITY_PUBLIC ? true : false, req);
        }

        History.create('Media S3 Image ACH Updation Job Completed', req);

        await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
          if (err) {
            throw new err();
          }
        });
      } else {
        History.create('Media S3 Image ACH Updation Job : Media Not Found', req);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = updateS3Image;
