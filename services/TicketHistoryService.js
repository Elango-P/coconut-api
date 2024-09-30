const utils = require("../lib/utils");

// Models
const { IndexTicket, TicketHistory } = require("../db").models;

const ticketHistoryService = module.exports = {
	/**
	 * Create Ticket History
	 *
	 * @param data
	 * @param callback
	 * @returns {PromiseLike<T> | Promise<T>}
	 */
	create: (data, callback) =>
		TicketHistory
			.create({
				ticket_id: data.ticket_id,
				field: data.field,
				original_value: data.original_value,
				new_value: data.new_value,
				created_by: data.created_by,
				comments: data.comments,
				date: data.date || null
			})
			.then((ticketHistory) => callback(null, ticketHistory)),

	/**
	 * Create Ticket TicketHistory For Ticket Create
	 *
	 * @param ticket
	 * @param callback
	 */
	createTicketHistory: (ticket, callback) => {
		if (!ticket) {
			return callback();
		}

		IndexTicket.findOne({ where: { id: ticket.id } })
			.then((newTicket) => {
				const comments = `created ${newTicket ? newTicket.type_name : ""}`;
				TicketHistory
					.create({
						ticket_id: ticket.id,
						status: ticket.status,
						field: ticket.field,
						original_value: ticket.original_value,
						new_value: ticket.new_value,
						created_by: ticket.updated_by,
						comments
					})
					.then(() => callback());
			});
	},

	/**
	 * Create Ticket History For Ticket Update
	 *
	 * @param oldTicket
	 * @param ticket
	 * @param callback
	 */
	updateTicketHistory: (oldTicket, ticket, callback) => {
		let original_value, new_value, field;

		IndexTicket.findOne({ where: { id: ticket.id } })
			.then((newTicket) => {
				const attributes = ticket ? ticket.field : null;
				if (oldTicket && newTicket) {
					if (attributes === "status" && oldTicket.status !== newTicket.status) {
						original_value = oldTicket.status_name;
						new_value = newTicket.status_name;
						field = attributes;
					}

					if (attributes === "summary" && oldTicket.summary !== newTicket.summary) {
						original_value = utils.rawURLDecode(oldTicket.summary);
						new_value = utils.rawURLDecode(newTicket.summary);
						field = attributes;
					}

					if (attributes === "affectedVersion" && oldTicket.affected_version !== newTicket.affected_version) {
						original_value = oldTicket.affected_version_name;
						new_value = newTicket.affected_version_name;
						field = attributes;
					}

					if (attributes === "releaseId" && oldTicket.release_id !== newTicket.release_id) {
						original_value = oldTicket.release_name;
						new_value = newTicket.release_name;
						field = attributes;
					}

					if (attributes === "sprintId" && oldTicket.sprint_id !== newTicket.sprint_id) {
						original_value = oldTicket.sprint_name;
						new_value = newTicket.sprint_name;
						field = attributes;
					}

					if (attributes === "projectId" && oldTicket.project_id !== newTicket.project_id) {
						original_value = oldTicket.project_name;
						new_value = newTicket.project_name;
					}

					if (attributes === "typeId" && oldTicket.type_id !== newTicket.type_id) {
						original_value = oldTicket.type_name;
						new_value = newTicket.type_name;
						field = attributes;
					}

					if (attributes === "severityId" && oldTicket.severity_id !== newTicket.severity_id) {
						original_value = oldTicket.severity_name;
						new_value = newTicket.severity_name;
						field = attributes;
					}

					if (attributes === "priority" && oldTicket.priority !== newTicket.priority) {
						original_value = oldTicket.priority_name;
						new_value = newTicket.priority_name;
						field = attributes;
					}

					if (attributes === "component" && oldTicket.component !== newTicket.component) {
						original_value = oldTicket.component_name;
						new_value = newTicket.component_name;
						field = attributes;
					}

					if (attributes === "reportedBy" && oldTicket.reported_by !== newTicket.reported_by) {
						original_value = oldTicket.reported_by_name;
						new_value = newTicket.reported_by_name;
						field = attributes;
					}

					if (attributes === "assignedTo" && oldTicket.assigned_to !== newTicket.assigned_to) {
						original_value = oldTicket.assigned_to_name;
						new_value = newTicket.assigned_to_name;
						field = attributes;
					}

					if (attributes === "reviewer" && oldTicket.reviewer !== newTicket.reviewer) {
						original_value = oldTicket.reviewer_name;
						new_value = newTicket.reviewer_name;
						field = attributes;
					}

					if (attributes === "reportedAt" && utils.formatLocalDate(oldTicket.jira_created_at) !== utils.formatLocalDate(newTicket.jira_created_at)) {
						original_value = utils.formatLocalDate(oldTicket.jira_created_at, "DD-MMM-YYYY");
						new_value = utils.formatLocalDate(newTicket.jira_created_at, "DD-MMM-YYYY");
						field = attributes;
					}

					if (attributes === "eta" && utils.formatLocalDate(oldTicket.eta) !== utils.formatLocalDate(newTicket.eta)) {
						original_value = utils.formatLocalDate(oldTicket.eta, "DD-MMM-YYYY");
						new_value = utils.formatLocalDate(newTicket.eta, "DD-MMM-YYYY");
						field = attributes;
					}

					if (attributes === "storyPoints" && oldTicket.story_points !== newTicket.story_points) {
						original_value = oldTicket.story_points;
						new_value = newTicket.story_points;
						field = attributes;
					}

					if (attributes === "estimatedHours" && oldTicket.estimated_hours !== newTicket.estimated_hours) {
						original_value = oldTicket.estimated_hours;
						new_value = newTicket.estimated_hours;
						field = attributes;
					}

					if (attributes === "actualHours" && oldTicket.actual_hours !== newTicket.actual_hours) {
						original_value = oldTicket.actual_hours;
						new_value = newTicket.actual_hours;
						field = attributes;
					}

					if (attributes === "ticketId" && oldTicket.ticket_id !== newTicket.ticket_id) {
						original_value = oldTicket.ticket_id;
						new_value = newTicket.ticket_id;
						field = attributes;
					}

					if (attributes === "parentTicketId" && oldTicket.parent_ticket_id !== newTicket.parent_ticket_id) {
						original_value = oldTicket.parent_ticket_id;
						new_value = newTicket.parent_ticket_id;
						field = attributes;
					}

					if (attributes === "jiraTicketId" && oldTicket.external_ticket_id !== newTicket.external_ticket_id) {
						original_value = oldTicket.external_ticket_id;
						new_value = newTicket.external_ticket_id;
						field = attributes;
					}

					if (attributes === "description" && oldTicket.description !== newTicket.description) {
						original_value = utils.rawURLDecode(oldTicket.description);
						new_value = utils.rawURLDecode(newTicket.description);
						field = attributes;
					}

					if (attributes === "acceptanceCriteria" && oldTicket.acceptance_criteria !== newTicket.acceptance_criteria) {
						original_value = utils.rawURLDecode(oldTicket.acceptance_criteria);
						new_value = utils.rawURLDecode(newTicket.acceptance_criteria);
						field = attributes;
					}

					if (attributes === "environment" && oldTicket.environment !== newTicket.environment) {
						original_value = utils.rawURLDecode(oldTicket.environment);
						new_value = utils.rawURLDecode(newTicket.environment);
						field = attributes;
					}

					if (attributes === "testStep" && oldTicket.test_step !== newTicket.test_step) {
						original_value = utils.rawURLDecode(oldTicket.test_step);
						new_value = utils.rawURLDecode(newTicket.test_step);
						field = attributes;
					}

					if (attributes === "actualResults" && oldTicket.actual_results !== newTicket.actual_results) {
						original_value = utils.rawURLDecode(oldTicket.actual_results);
						new_value = utils.rawURLDecode(newTicket.actual_results);
						field = attributes;
					}

					if (attributes === "expectedResults" && oldTicket.expected_results !== newTicket.expected_results) {
						original_value = utils.rawURLDecode(oldTicket.expected_results);
						new_value = utils.rawURLDecode(newTicket.expected_results);
						field = attributes;
					}
				}

				const comments = "made changes";
				if (original_value || new_value) {
					return TicketHistory
						.create({
							ticket_id: ticket.id,
							field,
							original_value,
							new_value,
							created_by: ticket.updated_by,
							comments
						})
						.then((ticketHistory) => callback(null, ticketHistory));
				}
				return callback();
			});
	},

	/**
	 *Create Ticket History For Create And Update Ticket Comment
	 *
	 * @param id
	 * @param ticketComment
	 * @param callback
	 * @returns {*}
	 */
	createTicketCommentsTicketHistory: (id, ticketComment, callback) => {
		let comments = "added comments";
		if (id) {
			comments = "updated comments";
		}
		if (ticketComment.original_value !== ticketComment.new_value || !ticketComment.new_value && id) {
			return TicketHistory
				.create({
					ticket_id: ticketComment.ticket_id,
					field: ticketComment.field,
					original_value: utils.rawURLDecode(ticketComment.original_value),
					new_value: utils.rawURLDecode(ticketComment.new_value),
					created_by: ticketComment.updated_by,
					comments
				})
				.then(() => callback());
		}
		return callback();
	},

	/**
	 * Create Ticket History For Create AND Update Ticket Test
	 *
	 * @param ticketTest
	 * @param callback
	 * @returns {*}
	 */
	createTicketTestTicketHistory: (ticketTest, callback) => {
		let comments = "added ticket test";
		if (ticketTest.ticketTestId) {
			comments = "updated ticket test";
		}
		ticketTest.comments = comments;
		if (ticketTest.original_value !== ticketTest.new_value || !ticketTest.new_value && ticketTest.ticketTestId) {
			return ticketHistoryService.create(ticketTest, (err) => {
				if (err) {
					callback(err);
				}
				return callback();
			});
		}
		return callback();
	},

	/**
	 * Create Ticket History For Create AND Update Ticket Test Result
	 *
	 * @param ticketTestResult
	 * @param callback
	 * @returns {*}
	 */
	createTicketTestResultTicketHistory: (ticketTestResult, callback) => {
		let comments = "added ticket test result";
		if (ticketTestResult.ticketTestResultId) {
			comments = "updated ticket test result";
		}
		ticketTestResult.comments = comments;
		if (ticketTestResult.original_value !== ticketTestResult.new_value || !ticketTestResult.new_value && ticketTestResult.ticketTestResultId) {
			ticketHistoryService.create(ticketTestResult, (err) => {
				if (err) {
					return callback(err);
				}
				return callback();
			});
		} else {
			return callback();
		}
	},

	/**
	 * Create Ticket History For Create AND Update Ticket Test Attachment
	 *
	 * @param ticketTestAttachment
	 * @param callback
	 * @returns {*}
	 */
	createTicketAttachmentTicketHistory: (ticketTestAttachment, callback) => {
		let comments = "added ticket attachments";
		if (ticketTestAttachment.ticketAttachmentId) {
			comments = "updated ticket attachments";
		}
		ticketTestAttachment.comments = comments;
		if (ticketTestAttachment.original_value !== ticketTestAttachment.new_value || !ticketTestAttachment.new_value && ticketTestAttachment.ticketTestResultId) {
			ticketHistoryService.create(ticketTestAttachment, (err) => {
				if (err) {
					callback(err);
				}

				return callback();
			});
		}
	},

	/**
	 * Create Ticket History For Create And Update Ticket Test Result Attachment
	 *
	 * @param ticketTestResultAttachment
	 * @param callback
	 */
	createTicketTestResultAttachmentTicketHistory: (ticketTestResultAttachment, callback) => {
		let comments = "added ticket test result attachments";
		if (ticketTestResultAttachment.ticketTestResultAttachmentId) {
			comments = "updated ticket test result attachments";
		}

		if (ticketTestResultAttachment.original_value !== ticketTestResultAttachment.new_value || !ticketTestResultAttachment.new_value && ticketTestResultAttachment.ticketTestResultAttachmentId) {
			ticketTestResultAttachment.comments = comments;
			ticketHistoryService.create(ticketTestResultAttachment, (err) => {
				if (err) {
					callback(err);
				}
				
				return callback();
			});
		}
	},

	/**
	 * For Create And Update For Ticket Task
	 *
	 * @param ticketUseCase
	 * @param callback
	 * @returns {*}
	 */
	createTicketTaskTicketHistory: (ticketTask, callback) => {
		let comments = "added ticket task";
		if (ticketTask.ticketTaskId) {
			comments = "updated ticket task";
		}
		ticketTask.comments = comments;
		if (ticketTask.original_value !== ticketTask.new_value || !ticketTask.new_value && ticketTask.ticketTestId) {
			return ticketHistoryService.create(ticketTask, (err) => {
				if (err) {
					callback(err);
				}
				return callback();
			});
		}
		return callback();
	},
};
