const async = require("async");
const { Op } = require("sequelize");

// Ticket Notification Service
const ticketNotificationService = require("./notifications/ticket");

// Models
const {
  User,
  Ticket,
  ProjectRelease,
  ProjectSprint,
  TicketComponent,
  ProjectSeverity,
  TicketStatus,
  Project,
  ProjectPriority,
  IndexTicket,
  TicketAttachment,
  ProjectTicketType,
} = require("../db").models;

const attributes = [
  "id",
  "ticket_id",
  "jira_ticket_id",
  "trello_ticket_id",
  "parent_id",
  "summary",
  "project_id",
  "status",
  "type_id",
  "affected_version",
  "sprint_id",
  "release_id",
  "priority",
  "severity_id",
  "component",
  "labels",
  "description",
  "environment",
  "build_number",
  "test_step",
  "acceptance_criteria",
  "actual_results",
  "expected_results",
  "reported_by",
  "assigned_to",
  "reviewer",
  "created_at",
  "updated_at",
  "jira_created_at",
  "eta",
  "delivery_date",
  "completed_at",
  "story_points",
  "estimated_hours",
  "actual_hours",
  "test_suite_id",
  "system_hours",
  "tested_environment",
  "tested_build",
  "jira_status_name",
  "status_changed_at",
  "applicable_devices",
  "production_status",
];

const include = [
  {
    required: false,
    model: Ticket,
    as: "parentTicket",
    attributes: ["ticket_id"],
  },
  {
    required: true,
    model: Project,
    as: "project",
    attributes: [
      "name",
      "jira_host",
      "slug",
      "slack_webhook_key",
      "trello_board_id",
    ],
  },
  {
    required: false,
    model: TicketStatus,
    as: "ticketStatus",
    attributes: ["group_id", "name"],
  },
  {
    required: false,
    model: ProjectTicketType,
    as: "projectTicketType",
    attributes: ["name", "type"],
  },
  {
    required: false,
    model: ProjectRelease,
    as: "affectedVersion",
    attributes: ["name"],
  },
  {
    required: false,
    model: ProjectSprint,
    as: "projectSprint",
    attributes: ["name"],
  },
  {
    required: false,
    model: ProjectRelease,
    as: "projectRelease",
    attributes: ["name"],
  },
  {
    required: false,
    model: ProjectPriority,
    as: "projectPriority",
    attributes: ["name"],
  },
  {
    required: false,
    model: ProjectSeverity,
    as: "projectSeverity",
    attributes: ["name"],
  },
  {
    required: false,
    model: TicketComponent,
    as: "ticketComponent",
    attributes: ["name"],
  },
  {
    required: false,
    model: User,
    as: "reportedUser",
    attributes: ["name"],
  },
  {
    required: false,
    model: User,
    as: "user",
    attributes: ["name"],
  },
  {
    required: false,
    model: User,
    as: "reviewerUser",
    attributes: ["name"],
  },
  {
    required: false,
    model: TicketAttachment,
    as: "ticketAttachments",
    attributes: ["id", "ticket_id", "media_name"],
  },
];

const indexTicketService = (module.exports = {
  /**
   * ReIndex By Id
   *
   * @param {*} id
   * @param {*} callback
   */
  reIndex: (id, callback) => {
    Ticket.findAll({
      attributes,
      include,
      where: {
        [Op.or]: [{ id }, { parent_id: id }],
      },
    }).then((tickets) =>
      async.eachSeries(
        tickets,
        (ticket, cb) => indexTicketService.saveByTicket(ticket, cb),
        callback
      )
    );
  },

  reIndexAll: (callback) => {
    Project.findAll({
      attributes: ["id"],
    }).then((projects) => {
      async.eachSeries(
        projects,
        (project, projectCB) => {
          project = project.get();
          Ticket.findAll({
            attributes,
            include,
            where: { project_id: project.id },
          }).then((tickets) =>
            async.eachSeries(
              tickets,
              (ticket, cb) => indexTicketService.saveByTicket(ticket, cb),
              projectCB
            )
          );
        },
        () => ticketNotificationService.ticketReIndexSuccess(() => callback())
      );
    });
  },

  /**
   * ReIndex By Project
   *
   * @param {*} id
   * @param {*} callback
   */
  reIndexByProject: (id, callback) => {
    Project.findOne({
      attributes: ["id"],
      where: { id },
    }).then((project) => {
      if (!project) {
        return callback();
      }

      project = project.get();

      Ticket.findAll({
        attributes,
        include,
        where: { project_id: project.id },
      }).then((tickets) => {
        async.eachSeries(
          tickets,
          (ticket, cb) => indexTicketService.saveByTicket(ticket, cb),
          () => {
            return ticketNotificationService.ticketReIndexSuccess(() =>
              callback()
            );
          }
        );
      });
    });
  },

  /**
   * Save By Ticket
   *
   * @param {*} ticket
   * @param {*} callback
   * @returns
   */
  saveByTicket: (ticket, callback) => {
    ticket = ticket.get();

    const project = ticket.project ? ticket.project.get() : {};
    const parentTicket = ticket.parentTicket ? ticket.parentTicket.get() : {};
    const ticketStatus = ticket.ticketStatus ? ticket.ticketStatus.get() : {};
    const projectTicketType = ticket.projectTicketType
      ? ticket.projectTicketType.get()
      : {};
    const affectedVersion = ticket.affectedVersion
      ? ticket.affectedVersion.get()
      : {};
    const projectSprint = ticket.projectSprint
      ? ticket.projectSprint.get()
      : {};
    const projectRelease = ticket.projectRelease
      ? ticket.projectRelease.get()
      : {};
    const projectPriority = ticket.projectPriority
      ? ticket.projectPriority.get()
      : {};
    const projectSeverity = ticket.projectSeverity
      ? ticket.projectSeverity.get()
      : {};
    const ticketComponent = ticket.ticketComponent
      ? ticket.ticketComponent.get()
      : {};
    const reportedUser = ticket.reportedUser ? ticket.reportedUser.get() : {};
    const assignedTo = ticket.user ? ticket.user.get() : {};
    const reviewerUser = ticket.reviewerUser ? ticket.reviewerUser.get() : {};

    const external_ticket_id = ticket.trello_ticket_id || ticket.jira_ticket_id;
    const { slug, jira_host, trello_board_id } = project;

    let jira_ticket_url = "",
      trello_ticket_url = "";

    if (external_ticket_id) {
      if (jira_host) {
        jira_ticket_url = `https://${jira_host}/browse/${external_ticket_id}`;
      }

      if (trello_board_id) {
        trello_ticket_url = `https://trello.com/c/${external_ticket_id}`;
      }
    }

    const reference_screenshots = [];
    if (ticket.ticketAttachments) {
      const attachments = ticket.ticketAttachments;
      attachments.forEach((attachment) => {
        attachment = attachment.get();
        reference_screenshots.push({
          ticketAttachmentId: attachment.id,
          mediaName: attachment.media_name,
          mediaUrl: `/${attachment.ticket_id}/${attachment.media_name}`,
        });
      });
    }

    const parent_ticket_id = parentTicket.ticket_id;
    const ticket_id = ticket.ticket_id;
    const ticket_url = ticket_id ? `/${slug}/${ticket_id}` : "";
    const summary = ticket.summary;
    const acceptance_criteria = ticket.acceptance_criteria;
    const slack_webhook_key = project.slack_webhook_key;

    const data = {
      id: ticket.id,
      ticket_id,
      ticket_url,
      external_ticket_id,
      trello_board_id,
      jira_ticket_url,
      trello_ticket_url,
      parent_id: ticket.parent_id,
      parent_ticket_id,
      parent_ticket_url: parent_ticket_id ? `/${slug}/${parent_ticket_id}` : "",
      summary,
      acceptance_criteria,
      project_id: ticket.project_id,
      project_name: project.name,
      status: ticket.status,
      status_name: ticketStatus && ticketStatus.name,
      status_group_id: ticketStatus && ticketStatus.group_id ? ticketStatus.group_id : null,
      type_id: ticket.type_id,
      type_name: projectTicketType.name,
      project_ticket_type: projectTicketType.type || null,
      affected_version: ticket.affected_version,
      affected_version_name: affectedVersion.name || null,
      sprint_id: ticket.sprint_id,
      sprint_name: projectSprint.name || null,
      release_id: ticket.release_id,
      release_name: projectRelease.name || null,
      priority: ticket.priority,
      jira_status_name: ticket.jira_status_name,
      priority_name: projectPriority.name || null,
      severity_id: ticket.severity_id,
      severity_name: projectSeverity.name || null,
      component: ticket.component,
      component_name: ticketComponent.name || null,
      labels: ticket.labels,
      description: ticket.description,
      environment: ticket.environment,
      build_number: ticket.build_number,
      test_step: ticket.test_step,
      actual_results: ticket.actual_results,
      expected_results: ticket.expected_results,
      reference_screenshots,
      reported_by: ticket.reported_by,
      reported_by_name: reportedUser.name,
      assigned_to: ticket.assigned_to,
      assigned_to_name: assignedTo.name,
      reviewer: ticket.reviewer,
      reviewer_name: reviewerUser.name,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      jira_created_at: ticket.jira_created_at,
      eta: ticket.eta,
      completed_at: ticket.completed_at,
      story_points: ticket.story_points,
      estimated_hours: ticket.estimated_hours,
      actual_hours: ticket.actual_hours,
      system_hours: ticket.system_hours,
      tested_environment: ticket.tested_environment,
      tested_build: ticket.tested_build,
      status_changed_at: ticket.status_changed_at,
      slack_webhook_key: ticket.slack_webhook_key,
      jira_host,
      test_suite_id: ticket.test_suite_id,
      delivery_date: ticket.delivery_date,
      applicable_devices: ticket.applicable_devices,
      production_status: ticket.production_status || null,
    };

    return IndexTicket.upsert(data, { id: ticket.id })
      .then(() => callback())
      .catch((err) =>
        ticketNotificationService.ticketReIndexFailed(
          ticket_id,
          ticket_url,
          summary,
          `Ticket ReIndex Failed - ${err.message}`,
          callback
        )
      );
  },
});
