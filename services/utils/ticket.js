const async = require("async");
const { Op } = require("sequelize");

// User Roles Groups
const roles = require("../../routes/user/roles");

// Ticket Status Groups
const groups = require("../../routes/ticketStatus/groups");

// Utils
const utils = require("../../lib/utils");

// Activity Status
const {
  HOLD,
  IN_PROGRESS,
  REQUIRED,
  REQUIRED_WITH_COUNT,
} = require("../../routes/activity/statuses");

// Models
const {
  ProjectRelease,
  Project,
  ProjectSprint,
  TicketTest,
  TicketTestResult,
  ProjectPriority,
  TicketComponent,
  TicketStatus,
  IndexTicket,
  TicketComment,
  Ticket,
  User,
  TicketTask,
  ProjectTicketType,
  ProjectTicketStatusRelation,
  JiraProjectTicketType,
} = require("../../db").models;

// Slack Notification
const {
  sendTicketStatusChangedNotification,
  sendReporterNotification,
  sendReviewerNotification,
  sendDueDateChangeNotification,
  sendTicketAssigneeChangedNotification,
} = require("../../services/notifications/ticket");

const ticketUtils = (module.exports = {
  /**
   * Get Next Ticket Id
   *
   * @param ticketId
   * @param parentId
   * @param projectId
   * @param callback
   */
  getNextTicketId: (ticketId, parentId, projectId, callback) => {
    if (ticketId) {
      return callback(null, ticketId);
    }

    if (parentId) {
      Promise.all([
        Ticket.findOne({ attributes: ["ticket_id"], where: { id: parentId } }),
        Ticket.count({ paranoid: false, where: { parent_id: parentId } }),
      ]).then(([ticket, count]) => {
        count = count + 1;
        callback(
          null,
          `${ticket.ticket_id}-${count < 10 ? `0${count}` : count}`
        );
      });
    } else {
      Project.findOne({
        attributes: ["code", "last_ticket_id"],
        where: { id: projectId, status: 1 },
      }).then((project) =>
        callback(
          null,
          `${project.code}-${parseInt(project.last_ticket_id, 10) + 1}`
        )
      );
    }
  },

  /**
   * Get Ticket Status
   *
   * @param statusId
   * @param typeId
   * @param callback
   */
  getTicketStatus: (statusId, typeId, callback) => {
    if (statusId) {
      return callback(null, statusId);
    }

    if (!typeId) {
      return callback();
    }

    ProjectTicketType.findOne({
      attributes: ["id"],
      where: { id: typeId, status: 1 },
    }).then((projectTicketType) => {
      if (!projectTicketType) {
        return callback(new Error("Invalid project ticket type"));
      }

      TicketStatus.findOne({
        attributes: [
          "id",
          "name",
          "default_assignee",
          "default_reviewer",
          "default_eta",
          "default_story_points",
        ],
        where: { project_type_id: typeId, status: 1 },
        order: [["sort", "ASC"]],
        limit: 1,
      }).then((ticketStatus) => {
        if (!ticketStatus) {
          return callback();
        }

        return callback(null, ticketStatus);
      });
    });
  },

  /**
   * Validate Parent Ticket
   *
   * @param id
   * @param callback
   */
  validateParentTicket: (id, callback) => {
    if (!id) {
      return callback();
    }

    ticketUtils.getTicket(
      { id, fields: ["id", "eta", "jira_ticket_id"] },
      (err, ticket) => {
        if (!ticket) {
          return callback(new Error("Invalid parent ticket"));
        }

        return callback(null, ticket);
      }
    );
  },

  /**
   * Get Project Ticket Type
   *
   * @param typeId
   * @param callback
   */
  getProjectTicketType: (typeId, callback) => {
    if (!typeId) {
      return callback();
    }

    ProjectTicketType.findOne({
      attributes: ["type"],
      where: { id: typeId, status: 1 },
    }).then((projectTicketType) => {
      if (!projectTicketType) {
        return callback();
      }

      return callback(null, projectTicketType.type);
    });
  },

  /**
   * Get Jira Project Ticket Type
   *
   * @param typeId
   * @param callback
   */
  getJiraProjectTicketType: (typeId, jiraTicketTypeId, callback) => {
    if (typeId && !jiraTicketTypeId) {
      return callback();
    }

    JiraProjectTicketType.findOne({
      attributes: [
        "id",
        "jira_project_ticket_type_id",
        "project_ticket_type_id",
      ],
      where: { jira_project_ticket_type_id: jiraTicketTypeId },
    }).then((jiraProjectTicketType) => {
      if (!jiraProjectTicketType) {
        return callback();
      }

      return callback(null, jiraProjectTicketType.project_ticket_type_id);
    });
  },

  /**
   * Get Ticket
   *
   * @param data
   * @param callback
   */
  getTicket: (data, callback) => {
    const query = { where: { id: data.id, is_active: 1 } };
    if (data.fields) {
      query.attributes = data.fields;
    }

    Ticket.findOne(query).then((ticket) => callback(null, ticket));
  },

  /**
   * Get Index Ticket
   *
   * @param data
   * @param callback
   */
  getIndexTicket: (data, callback) => {
    const query = { where: { id: data.id } };
    if (data.fields) {
      query.attributes = data.fields;
    }

    IndexTicket.findOne(query).then((ticket) => callback(null, ticket));
  },

  /**
   * Update Last Ticket Id
   *
   * @param ticketIdGenerated
   * @param id
   * @param isParentTicket
   * @param callback
   * @returns {*}
   */
  updateLastTicketId: (ticketIdGenerated, id, isParentTicket, callback) => {
    if (!id || !ticketIdGenerated) {
      return callback();
    }

    if (isParentTicket) {
      return callback();
    }

    Project.findOne({
      attributes: ["id", "last_ticket_id"],
      where: { id, status: 1 },
    }).then((project) => {
      project
        .update({
          last_ticket_id: parseInt(project.get().last_ticket_id, 10) + 1,
        })
        .then(() => callback())
        .catch((err) => callback(err));
    });
  },

  /**
   * Get Project
   *
   * @param id
   * @param callback
   */
  getProject: (id, callback) => {
    Project.findOne({
      attributes: [
        "jira_host",
        "update_jira",
        "slug",
        "slack_webhook_key",
        "jira_auth_type",
      ],
      where: { id },
    }).then((project) => callback(null, project));
  },

  /**
   * Validate Project
   *
   * @param id
   * @param callback
   */
  validateProject: (id, callback) => {
    Project.count({ where: { id, status: 1 } }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid project"));
      }

      return callback();
    });
  },

  /**
   * Validate Ticket Id
   *
   * @param data
   * @param callback
   */
  validateTicketId: (data, callback) => {
    if (!data.ticketId) {
      return callback();
    }

    const where = { ticket_id: data.ticketId, project_id: data.projectId };

    if (data.id) {
      where.id = { [Op.ne]: data.id };
    }

    Ticket.count({ where }).then((count) => {
      if (count) {
        return callback(new Error("Duplicate ticket id"));
      }

      return callback();
    });
  },

  /**
   * Validate Project Release
   *
   * @param validate
   * @param id
   * @param callback
   * @returns {*}
   */
  validateProjectRelease: (validate, id, callback) => {
    if (!validate) {
      return callback();
    }

    const ACTIVE = 1;
    const FUTURE = 2;

    ProjectRelease.count({
      where: { id, status: { $in: [ACTIVE, FUTURE] } },
    }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid project release"));
      }

      return callback();
    });
  },

  /**
   * Validate Project Sprint
   *
   * @param validate
   * @param id
   * @param callback
   * @returns {*}
   */
  validateProjectSprint: (validate, id, callback) => {
    if (!validate) {
      return callback();
    }

    const ACTIVE = 1;
    const FUTURE = 2;

    ProjectSprint.count({
      where: { id, status: { $in: [ACTIVE, FUTURE] } },
    }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid project sprint"));
      }

      return callback();
    });
  },

  /**
   * Validate Affected Version
   *
   * @param validate
   * @param id
   * @param callback
   * @returns {*}
   */
  validateAffectedVersion: (validate, id, callback) => {
    if (!validate) {
      return callback();
    }

    ProjectRelease.count({ where: { id, status: 1 } }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid affected version"));
      }

      return callback();
    });
  },

  /**
   * Validate InProgress Status Group
   *
   * @param changedStatus
   * @param status
   * @param assigned_to
   * @param ticket_id
   * @param callback
   * @returns {*}
   */
  validateInProgressStatusGroup: (
    changedStatus,
    status,
    assigned_to,
    ticket_id,
    callback
  ) => {
    if (!changedStatus) {
      return callback();
    }

    ticketUtils.getStatus(status, (err, ticketStatus) => {
      if (err) {
        return callback(err);
      }

      const groupIds = ticketStatus.group_id.toString().split(",");
      if (groupIds.indexOf(groups.INPROGRESS.toString())) {
        return callback();
      }

      Ticket.count({
        include: [
          {
            required: true,
            model: TicketStatus,
            as: "ticketStatus",
            attributes: ["name", "group_id"],
            where: [`FIND_IN_SET(${groups.INPROGRESS}, group_id)`],
          },
        ],
        where: { is_active: 1, assigned_to, id: { [Op.ne]: ticket_id } },
      }).then((inProgressCount) => {
        if (inProgressCount > 0) {
          return callback(
            new Error(
              "You are not allowed to work on more than one ticket at a time"
            )
          );
        }

        return callback();
      });
    });
  },

  /**
   * Validate Project Priority
   *
   * @param id
   * @param callback
   */
  validateProjectPriority: (id, callback) => {
    if (!id) {
      return callback();
    }

    ProjectPriority.count({ where: { id, status: 1 } }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid project priority"));
      }

      return callback();
    });
  },

  /**
   * Validate Component
   *
   * @param id
   * @param callback
   */
  validateComponent: (id, callback) => {
    if (!id) {
      return callback();
    }

    TicketComponent.count({ where: { id, status: 1 } }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid ticket component"));
      }

      return callback();
    });
  },

  /**
   * Validate Status
   *
   * @param data
   * @param callback
   * @returns {*}
   */
  validateStatus: (data, callback) => {
    if (!data.id) {
      return callback();
    }

    ticketUtils.getNextStatusesIds(
      data.previousStatus,
      (err, ticketNextStatusIds) => {
        if (err) {
          return callback(err);
        }

        if (ticketNextStatusIds.length > 0 && !data.allowUser) {
          if (ticketNextStatusIds.indexOf(data.id) < 0) {
            return callback(new Error("Invalid ticket status"));
          }
        }

        const promises = [
          TicketStatus.count({
            where: [
              `FIND_IN_SET(${data.role}, roles) AND id = ${data.id} AND status = 1`,
            ],
          }),
        ];

        if (data.allowUser) {
          promises.push(
            TicketStatus.count({
              where: [
                `FIND_IN_SET(${roles.LEAD}, roles) AND id = ${data.id} AND status = 1`,
              ],
            })
          );
        }

        Promise.all(promises).then((count, allowUserCount) => {
          if (!count && !allowUserCount) {
            return callback(new Error("Invalid ticket status"));
          }

          return callback();
        });
      }
    );
  },

  /**
   * Validate Project Ticket Type
   *
   * @param id
   * @param callback
   */
  validateProjectTicketType: (id, callback) => {
    ProjectTicketType.count({ where: { id, status: 1 } }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid project ticket type"));
      }

      return callback();
    });
  },

  /**
   * Validate Assignee
   *
   * @param id
   * @param callback
   */
  validateAssignee: (id, callback) => {
    if (!id) {
      return callback();
    }

    User.count({ where: { id, active: 1 } }).then((count) => {
      if (!count) {
        return callback(new Error("Invalid assignee"));
      }

      return callback();
    });
  },

  /**
   * Get Completed At
   *
   * @param ticket
   * @param status
   * @param callback
   * @returns {*}
   */
  getCompletedAt: (ticket, status, callback) => {
    if (!status) {
      return callback();
    }

    TicketStatus.findOne({
      attributes: ["group_id"],
      where: { id: status, status: 1 },
    }).then((ticketStatus) => {
      if (!ticketStatus) {
        return callback(new Error("Invalid ticket status"));
      }

      const groupIds = ticketStatus.group_id.toString().split(",");
      if (groupIds.indexOf(groups.COMPLETED.toString()) < 0) {
        return callback();
      }

      return callback(
        null,
        ticket.completed_at ? ticket.completed_at : utils.getSQlFormattedDate()
      );
    });
  },

  /**
   * Get status
   *
   * @param id
   * @param callback
   * @returns {*}
   */
  getStatus: (id, callback) => {
    if (!id) {
      return callback();
    }

    TicketStatus.findOne({
      attributes: ["id", "group_id", "name"],
      where: { id },
    }).then((ticketStatus) => {
      if (!ticketStatus) {
        return callback(new Error("Invalid ticket status"));
      }

      return callback(null, ticketStatus);
    });
  },

  /**
   * Get status
   *
   * @param id
   * @param callback
   * @returns {*}
   */
  getNextStatusesIds: (id, callback) => {
    if (!id) {
      return callback();
    }

    ProjectTicketStatusRelation.findAll({
      attributes: ["project_ticket_next_status_id"],
      where: { project_ticket_status_id: id },
    }).then((projectTicketStatusRelations) => {
      if (projectTicketStatusRelations.length < 0) {
        return callback();
      }

      const ticketNextStatusIds = [];
      projectTicketStatusRelations.forEach((projectTicketStatusRelation) => {
        const project_ticket_next_status_id =
          projectTicketStatusRelation.project_ticket_next_status_id;

        if (ticketNextStatusIds.indexOf(project_ticket_next_status_id) < 0) {
          ticketNextStatusIds.push(
            projectTicketStatusRelation.project_ticket_next_status_id
          );
        }
      });

      return callback(null, ticketNextStatusIds);
    });
  },

  /**
   * Validate Parent Ticket Id
   *
   * @param ticket_id
   * @param currentTicketId
   * @param project_id
   * @param callback
   * @returns {*}
   */
  validateParentTicketId: (
    ticket_id,
    currentTicketId,
    project_id,
    callback
  ) => {
    if (!ticket_id) {
      return callback(null, typeof ticket_id !== "undefined" ? "" : ticket_id);
    }

    Ticket.findOne({
      attributes: ["id"],
      where: { ticket_id, project_id },
    })
      .then((ticket) => {
        if (!ticket) {
          return callback(new Error("Invalid parent ticket id"));
        }

        if (ticket.id === currentTicketId) {
          return callback(
            new Error("Parent ticket id should not be same current ticket Id")
          );
        }

        callback(null, ticket.id);
      })
      .catch((err) => callback(err));
  },

  /**
   * Update all Tickets
   *
   * @param isUpdate
   * @param ticketId
   * @param data
   * @param callback
   * @returns {*}
   */
  updateAllTickets: (isUpdate, ticketId, data, callback) => {
    if (!isUpdate) {
      return callback();
    }

    const updateData = {};
    if (typeof data.releaseId !== "undefined") {
      updateData.release_id = data.releaseId || null;
    }
    if (data.projectId) {
      updateData.project_id = data.projectId;
    }
    if (data.sprintId) {
      updateData.sprint_id = data.sprintId;
    }
    if (data.affectedVersion) {
      updateData.affected_version = data.affectedVersion;
    }
    if (data.jiraTicketId) {
      updateData.jira_ticket_id = data.jiraTicketId;
    }
    if (data.labels) {
      updateData.labels = data.labels;
    }

    if (Object.keys(updateData).length === 0) {
      return callback();
    }

    Ticket.update(updateData, {
      where: {
        [Op.or]: [{ id: ticketId }, { parent_id: ticketId }],
      },
    })
      .then(() => callback(null, true))
      .catch((err) => callback(err));
  },

  /**
   * Add Comment
   *
   * @param comment
   * @param userId
   * @param tickedId
   * @param callback
   * @returns {*}
   */
  addComment: (comment, userId, tickedId, callback) => {
    if (!comment) {
      return callback();
    }

    TicketComment.create({
      ticket_id: tickedId,
      comment: utils.rawURLEncode(comment),
      updated_by: userId,
    })
      .then(() => callback())
      .catch((err) => callback(err));
  },

  /**
   * Validate Test Case
   *
   * @param oldTicketStatus
   * @param newTicketStatus
   * @param ticket_id
   * @param ticketType
   * @param callback
   * @returns {*}
   */
  validateTestCase: (
    oldTicketStatus,
    newTicketStatus,
    ticket_id,
    ticketType,
    callback
  ) => {
    if (!newTicketStatus || !ticketType || !ticket_id || !oldTicketStatus) {
      return callback();
    }

    const ticketTestWhereCondition = { ticket_id };

    let pendingCount = 0;
    if (
      newTicketStatus &&
      oldTicketStatus &&
      newTicketStatus.id !== oldTicketStatus.id
    ) {
      Promise.all([
        TicketTest.count({ where: ticketTestWhereCondition }),
        TicketTest.findAll({
          attributes: ["id"],
          where: ticketTestWhereCondition,
          include: [
            {
              required: false,
              model: TicketTestResult,
              as: "ticketTestResult",
              attributes: ["id", "status"],
            },
          ],
        }),
        TicketStatus.findOne({
          attributes: ["test_validation", "minimum_test_count"],
          where: { id: newTicketStatus.id },
        }),
      ])
        .then(([ticketTestCount, pendingCountList, ticketStatus]) => {
          const ticketStatusTestValidation = ticketStatus
            ? ticketStatus.test_validation
            : "";
          const minimumTestCount = ticketStatus
            ? ticketStatus.minimum_test_count
            : "";

          // If Test Validation is Not Found
          if (!ticketStatusTestValidation) {
            return callback();
          }

          // Show Required and Count
          if (!ticketTestCount && ticketStatusTestValidation === REQUIRED) {
            return callback(new Error("Test result is required"));
          }

          // Minimum Test case count  validation
          if (
            ticketStatusTestValidation &&
            minimumTestCount > ticketTestCount
          ) {
            return callback(
              new Error(`Minimum of ${minimumTestCount} test cases required`)
            );
          }

          let isPending = false;
          pendingCountList.forEach((ticketTest) => {
            ticketTest = ticketTest.get();
            const ticketTestResults = ticketTest.ticketTestResult;

            isPending =
              !isPending &&
              ticketTestResults.length === 0 &&
              ticketStatusTestValidation;

            ticketTestResults.forEach((ticketTestResult) => {
              ticketTestResult = ticketTestResult.get();

              if (!ticketTestResult.status) {
                pendingCount++;
              }
            });
          });

          // Show Required and Count
          if (
            isPending ||
            (ticketStatusTestValidation === REQUIRED_WITH_COUNT && pendingCount)
          ) {
            return callback(new Error("Update test cases"));
          }

          return callback();
        })
        .catch((err) => callback(err));
    } else {
      return callback();
    }
  },

  /**
   * Validate Ticket Tasks
   *
   * @param oldTicketStatus
   * @param newTicketStatus
   * @param ticket_id
   * @param callback
   * @returns {*}
   */
  validateTicketTasks: (
    oldTicketStatus,
    newTicketStatus,
    ticket_id,
    callback
  ) => {
    if (!ticket_id) {
      return callback();
    }

    if (
      newTicketStatus &&
      oldTicketStatus &&
      newTicketStatus.id !== oldTicketStatus.id &&
      newTicketStatus.group_id.split(",").indexOf(groups.REVIEW.toString()) >= 0
    ) {
      // Get Ticket Task in progress and Hold status count
      Promise.all([
        TicketTask.count({
          where: { ticket_id, status: { $in: [IN_PROGRESS, HOLD] } },
        }),
        TicketStatus.findOne({
          attributes: ["task_validation"],
          where: { id: newTicketStatus.id },
        }),
      ])
        .then(([ticketTaskHoldOrPendingCount, ticketStatus]) => {
          const ticketStatusTaskValidation = ticketStatus
            ? ticketStatus.task_validation
            : "";

          // If Task Validation is Not Found
          if (!ticketStatusTaskValidation) {
            return callback();
          }

          // Show Required and Not Count
          if (
            ticketStatusTaskValidation === REQUIRED &&
            !ticketTaskHoldOrPendingCount
          ) {
            return callback(new Error("Please add ticket task"));
          }

          // Show Required and Count
          if (
            ticketStatusTaskValidation === REQUIRED_WITH_COUNT &&
            ticketTaskHoldOrPendingCount > 0
          ) {
            return callback(new Error("Update ticket task to completed"));
          }

          return callback();
        })
        .catch((err) => callback(err));
    } else {
      return callback();
    }
  },

  /**
   * Validate Reported Ticket By Ticket Id
   *
   * @param {*} ticket_id
   * * @param {*} currentTicketStatus
   * @param {*} callback
   */
  validateReportedTicketsByTicketId(ticket_id, currentTicketStatus, callback) {
    if (!currentTicketStatus.validate_reported_tickets) {
      return callback();
    }

    TicketTest.findAll({
      attributes: ["id"],
      where: { ticket_id },
    }).then((ticketTests) => {
      const ticketTestIds = [];
      ticketTests.forEach((ticketTest) => {
        ticketTestIds.push(ticketTest.id);
      });

      TicketTestResult.findAll({
        attributes: ["reported_ticket_id"],
        where: { test_id: { $in: ticketTestIds } },
      }).then((ticketTestResults) => {
        if (!ticketTestResults.length) {
          return callback();
        }

        const reportedTicketsIds = [];
        ticketTestResults.forEach((ticketTestResult) => {
          if (ticketTestResult.reported_ticket_id) {
            reportedTicketsIds.push(ticketTestResult.reported_ticket_id);
          }
        });

        IndexTicket.findAll({
          attributes: ["id", "summary"],
          where: {
            id: { $in: reportedTicketsIds },
            status_group_id: { $in: [groups.INPROGRESS, groups.HOLD] },
          },
        }).then((indexTickets) => {
          if (!indexTickets.length) {
            return callback();
          }

          return callback(new Error("Please move reported tickets to review"));
        });
      });
    });
  },

  /**
   * Update All Tickets
   *
   * @param ticket
   * @param data
   * @returns {boolean}
   */
  canUpdateAllTickets: (ticket, data) => {
    if (data.projectId && data.projectId !== ticket.project_id) {
      return true;
    }

    if (
      typeof data.releaseId !== "undefined" &&
      data.releaseId !== ticket.release_id
    ) {
      return true;
    }

    if (data.labels && data.labels !== ticket.labels) {
      return true;
    }

    if (
      typeof data.sprintId !== "undefined" &&
      data.sprintId !== ticket.sprint_id
    ) {
      return true;
    }

    if (
      typeof data.affectedVersion !== "undefined" &&
      data.affectedVersion !== ticket.affected_version
    ) {
      return true;
    }

    if (
      typeof data.jiraTicketId !== "undefined" &&
      data.jiraTicketId !== ticket.jira_ticket_id
    ) {
      return true;
    }

    return false;
  },

  /**
   * Get Ticket Details By Id
   *
   * @param {*} id
   * @param {*} callback
   */
  getTicketDetailsById: (id, callback) => {
    if (!id) {
      return callback();
    }

    IndexTicket.findOne({
      attributes: [
        "id",
        "summary",
        "ticket_id",
        "ticket_url",
        "assigned_to_name",
        "assigned_to",
        "status_name",
        "type_name",
        "reported_by",
        "reported_by_name",
        "reviewer",
        "eta",
      ],
      where: { id },
    }).then((ticketDetail) =>
      callback(null, ticketDetail ? ticketDetail.get() : "")
    );
  },

  /**
   * Get Ticket Details By Assignee
   *
   * @param {*} ticketId
   * @param {*} callback
   */
  getTicketDetailsByAssignee: (
    loggedInUser,
    ticketId,
    isStatusChanged,
    callback
  ) => {
    if (!ticketId) {
      return callback();
    }

    IndexTicket.findOne({
      attributes: [
        "id",
        "summary",
        "ticket_id",
        "ticket_url",
        "assigned_to",
        "assigned_to_name",
        "status_name",
        "type_name",
      ],
      where: { id: ticketId },
      include: [
        {
          required: false,
          model: User,
          as: "user",
          attributes: ["slack_id", "name", "manager"],
        },
      ],
    }).then((ticketDetail) => {
      const user = ticketDetail ? ticketDetail.get().user : "";

      if (isStatusChanged) {
        ticketUtils.getUserDetailById(loggedInUser, (err, logInUserDetails) => {
          sendTicketStatusChangedNotification(
            ticketDetail,
            user,
            logInUserDetails.slack_id,
            () => callback()
          );
        });
      } else {
        ticketUtils.getUserDetailById(loggedInUser, (err, logInUserDetails) => {
          sendTicketAssigneeChangedNotification(
            logInUserDetails.slack_id,
            loggedInUser,
            ticketDetail,
            user,
            () => callback()
          );
        });
      }
    });
  },

  /**
   * Get User Details By Id
   *
   * @param {*} id
   * @param {*} callBack
   */
  getUserDetailById: (id, callBack) => {
    if (!id) {
      return callback();
    }

    User.findOne({
      attributes: ["id", "name", "slack_id", "manager"],
      where: { id },
    }).then((userDetails) =>
      callBack(null, userDetails ? userDetails.get() : "")
    );
  },

  /**
   * Get Ticket Details By Reporter
   *
   * @param {*} ticketId
   * @param {*} callback
   */
  getTicketDetailsByReporter: (loggedInUser, ticketId, callback) => {
    ticketUtils.getTicketDetailsById(ticketId, (err, ticketDetails) => {
      const { reported_by } = ticketDetails;
      if (!reported_by) {
        return callback();
      }

      ticketUtils.getUserDetailById(reported_by, (err, userDetails) => {
        ticketUtils.getUserDetailById(loggedInUser, (err, logInUserDetails) => {
          sendReporterNotification(
            loggedInUser,
            ticketDetails,
            userDetails,
            logInUserDetails.slack_id,
            () => callback()
          );
        });
      });
    });
  },

  /**
   * Get Ticket Details By Reviewer
   *
   * @param {*} ticketId
   * @param {*} callback
   */
  getTicketDetailsByReviewer: (loggedInUser, ticketId, callback) => {
    ticketUtils.getTicketDetailsById(ticketId, (err, ticketDetails) => {
      const { reviewer } = ticketDetails;
      if (!reviewer) {
        return callback();
      }

      ticketUtils.getUserDetailById(reviewer, (err, userDetails) => {
        ticketUtils.getUserDetailById(loggedInUser, (err, logInUserDetails) => {
          sendReviewerNotification(
            loggedInUser,
            ticketDetails,
            userDetails,
            logInUserDetails.slack_id,
            () => callback()
          );
        });
      });
    });
  },

  /**
   * Get Ticket Details By Reviewer
   *
   * @param {*} ticketId
   * @param {*} callback
   */
  getTicketDetailsByETA: (
    loggedInUser,
    loggedInSlackId,
    ticketId,
    callback
  ) => {
    ticketUtils.getTicketDetailsById(ticketId, (err, ticketDetails) => {
      const { assigned_to } = ticketDetails;
      if (!assigned_to) {
        return callback();
      }

      ticketUtils.getUserDetailById(assigned_to, (err, userDetails) => {
        sendDueDateChangeNotification(
          loggedInUser,
          loggedInSlackId,
          ticketDetails,
          userDetails,
          () => callback()
        );
      });
    });
  },
});
