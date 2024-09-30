const async = require("async");
const { Op } = require("sequelize");

// Utils
const utils = require("../lib/utils");

// Service
const indexTicketService = require("./indexTicket");

// Models
const { Activity, IndexTicket, TicketStatus, Ticket } = require("../db").models;

// Constants
const activityTypes = require("../routes/activity/types");
const groups = require("../routes/ticketStatus/groups");

// ReIndex Attendance
const reIndexAttendance = require("../routes/activity/reIndexAttendance");

const activityService = (module.exports = {
  /**
   * Get Productive Actual Hours
   *
   * @param {*} ticket_internal_id
   * @param {*} callback
   */
  getProductiveActualHours: (ticket_internal_id, callback) => {
    Activity.sum("actual_hours", {
      where: { ticket_internal_id, activity: activityTypes.PRODUCTIVE },
    }).then((totalActualHours) => callback(null, totalActualHours || 0));
  },

  /**
   * Update Total Actual Hours For Parent Ticket
   *
   * @param {*} ticket_internal_id
   * @param {*} callback
   */
  updateTotalActualHoursForParentTicket: (ticket_internal_id, callback) => {
    Ticket.findOne({
      attributes: ["parent_id"],
      where: { id: ticket_internal_id, parent_id: { [Op.ne]: null } },
    }).then((ticket) => {
      if (!ticket) {
        return callback();
      }

      const { parent_id } = ticket.get();

      Ticket.findAll({
        attributes: ["id"],
        where: { parent_id },
      }).then((subTickets) => {
        const ids = [];
        subTickets.forEach((subTicket) => {
          subTicket = subTicket.get();
          ids.push(subTicket.id);
        });

        if (ids.length === 0) {
          return callback();
        }

        Activity.sum("actual_hours", {
          where: { ticket_internal_id: { $in: ids }, status: "Approved" },
        }).then((totalActualHours) => {
          const actual_hours = totalActualHours || 0;
          Promise.all([
            Ticket.update({ actual_hours }, { where: { id: parent_id } }),
            IndexTicket.update({ actual_hours }, { where: { id: parent_id } }),
          ])
            .then(() => callback())
            .catch(() => callback());
        });
      });
    });
  },

  /**
   * Get Total Actual Hours
   * @param {*} ticket_internal_id
   * @param {*} callback
   */
  getTotalActualHours: (ticket_internal_id, callback) => {
    Activity.sum("actual_hours", {
      where: { ticket_internal_id, status: "Approved" },
    }).then((totalActualHours) => callback(null, totalActualHours || 0));
  },

  /**
   * Update Total Actual Hours
   *
   * @param {*} id
   * @param {*} status
   * @param {*} callback
   * @returns
   */
  updateTotalActualHours: (id, status, callback) => {
    if (!id || (status && status !== "Approved")) {
      return callback();
    }

    activityService.getTotalActualHours(id, (err, actual_hours) => {
      actual_hours = actual_hours || 0;
      Ticket.update({ actual_hours }, { where: { id } })
        .then(() => {
          indexTicketService.reIndex(id, () => callback());
        })
        .catch((err) => callback(err));
    });
  },

  isReviewStatus: (id, callback) => {
    TicketStatus.findOne({
      attributes: ["group_id"],
      where: { id },
    }).then((ticketStatus) => {
      if (!ticketStatus) {
        return callback();
      }

      const groupIds = ticketStatus.group_id.toString().split(",");
      if (
        (groupIds.indexOf(groups.HOLD.toString()) === 0 &&
          groupIds.indexOf(groups.REVIEW.toString()) > 0) ||
        (groupIds.indexOf(groups.REVIEW.toString()) === 0 &&
          groupIds.indexOf(groups.HOLD.toString()) > 0)
      ) {
        return callback();
      }

      return callback(null, true);
    });
  },

  /**
   * Get Tickets
   *
   * @param {*} ticketId
   * @param {*} ticketStatus
   * @param {*} callback
   * @returns
   */
  getTicket: (ticketId, ticketStatus, callback) => {
    if (!ticketId || !ticketStatus) {
      return callback();
    }

    activityService.isReviewStatus(ticketStatus, (err, isReview) => {
      if (!isReview) {
        return callback();
      }

      Ticket.findOne({
        attributes: [
          "id",
          "status",
          "assigned_to",
          "actual_hours",
          "estimated_hours",
          "system_hours",
          "summary",
        ],
        where: { id: ticketId },
      }).then((ticket) => {
        if (!ticket) {
          return callback(new Error("Ticket not found"));
        }

        return callback(null, ticket);
      });
    });
  },

  /**
   * Approve Status
   *
   * @param {*} activityIds
   * @param {*} callback
   */
  approveStatus: (activityIds, callback) => {
    Activity.findAll({
      attributes: ["id", "user_id", "date", "ticket_internal_id", "status"],
      where: { id: { $in: activityIds }, status: "Pending" },
    }).then((activities) => {
      async.eachSeries(
        activities,
        (activity, cb) => {
          activity.update({ status: "Approved" }).then((activityDetail) => {
            const activityData = activityDetail.get();
            const user_id = activityData.user_id;
            const status = activityData.status;
            const date = utils.formatLocalDate(activityData.date, "YYYY-MM-DD");

            return async.series(
              [
                (acb) =>
                  activityService.updateTotalActualHours(
                    activity.ticket_internal_id,
                    status,
                    acb
                  ),
                (acb) =>
                  activityService.updateTotalActualHoursForParentTicket(
                    activity.ticket_internal_id,
                    acb
                  ),
                (acb) => reIndexAttendance(user_id, date, acb),
              ],
              cb
            );
          });
        },
        () => callback()
      );
    });
  },

  /**
   * Delete Activity
   *
   * @param {*} activityIds
   * @param {*} callback
   */
  deleteActivity: (activityIds, callback) => {
    Activity.findAll({
      attributes: ["id", "user_id", "date", "ticket_internal_id", "status"],
      where: { id: { $in: activityIds } },
    }).then((activities) => {
      async.eachSeries(
        activities,
        (activity, cb) => {
          const activityData = activity.get();
          const ticket_internal_id = activityData.ticket_internal_id;
          const user_id = activityData.user_id;
          const status = activityData.status;
          const date = utils.formatLocalDate(activityData.date, "YYYY-MM-DD");

          activity
            .destroy()
            .then(() =>
              async.series(
                [
                  (acb) =>
                    activityService.updateTotalActualHours(
                      ticket_internal_id,
                      status,
                      acb
                    ),
                  (acb) =>
                    activityService.updateTotalActualHoursForParentTicket(
                      ticket_internal_id,
                      acb
                    ),
                  (acb) => reIndexAttendance(user_id, date, acb),
                ],
                cb
              )
            );
        },
        () => callback()
      );
    });
  },

  /**
   * Delete Ticket Activity
   *
   * @param {*} ticket_internal_ids
   * @param {*} callback
   */
  deleteTicketActivity: (ticket_internal_ids, callback) => {
    let where = {};
    if (typeof ticket_internal_ids === "object") {
      where = { ticket_internal_id: { $in: ticket_internal_ids } };
    } else {
      where = { ticket_internal_id: ticket_internal_ids };
    }
    Activity.findAll({
      attributes: ["id", "user_id", "date", "ticket_internal_id", "status"],
      where,
    }).then((activities) => {
      async.eachSeries(
        activities,
        (activity, cb) => {
          const activityData = activity.get();
          const ticket_internal_id = activityData.ticket_internal_id;
          const user_id = activityData.user_id;
          const status = activityData.status;
          const date = utils.formatLocalDate(activityData.date, "YYYY-MM-DD");

          activity
            .destroy()
            .then(() =>
              async.series(
                [
                  (acb) =>
                    activityService.updateTotalActualHours(
                      ticket_internal_id,
                      status,
                      acb
                    ),
                  (acb) =>
                    activityService.updateTotalActualHoursForParentTicket(
                      ticket_internal_id,
                      acb
                    ),
                  (acb) => reIndexAttendance(user_id, date, acb),
                ],
                cb
              )
            );
        },
        () => callback()
      );
    });
  },
});
