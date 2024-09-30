const validator = require('../../lib/validator');
const { SchedulerJob } = require('../../db').models;
const ObjectName = require('../../helpers/ObjectName');
const { STRING } = require('sequelize');
const History = require('../../services/HistoryService');
const Request =require("../../lib/request")

function bulkDelete(req, res, next) {
  const ids = req.body;
  let company_id = Request.GetCompanyId(req);
  if (!ids) {
    return next(validator.validationError('Invalid Scheduler Jobs Id'));
  }
  SchedulerJob.destroy({ where: { id: typeof ids == STRING ? ids.split(',') : ids, company_id } })
    .then(() => {
      res.json({ message: 'Scheduler jobs deleted' });
      res.on('finish', async () => {
        //create system log for product updation
        History.create('Scheduler Jobs deleted', req, ObjectName.SCHEDULER_JOB, ids);
      });
    })
    .catch((err) => {
      console.log(err);
      req.log.error(err);
      return next(err);
    });
}

module.exports = bulkDelete;
