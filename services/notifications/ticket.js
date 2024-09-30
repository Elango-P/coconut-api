const config = require("../../lib/config");

// Utils
const utils = require("../../lib/utils");

// Slack Notification

// Service
const userService = require("../UserService");

// Get Slack Channel Id
const SLACK_MESSAGE_TYPE_BOT = 1;

const DateTime = require("../../lib/dateTime");
const UserService = require("../UserService");
const SlackService = require("../SlackService");
const CompanyService = require("../CompanyService");
const StatusService = require("../StatusService");
const ProjectTicketTypeService = require("../projectTicketTypeService");
const NotificationService = require("../NotificationService");
const TicketService = require("../TicketService");
const Request = require("../../lib/request");

const dateTime = new DateTime();

const { Ticket, Project } = require('../../db').models;

module.exports = {
	/**
	 * Send scheduler for no open ticket notification
	 * 
	 * @param {*} slackId 
	 * @param {*} name 
	 * @param {*} callback 
	 */
	sendNoOpenTicketNotification: (slackId, name, callback) => {
		if (!slackId) {
			return callback();
		}

		const text = unescape(`${name} needs ticket to work next`);

		SlackService.sendMessage(slackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
	},

	/**
   * Send Slack Message To Ticket Assignee when comment added
   * @param {*} slackId 
   * @param {*} project
   * @param {*} ticket
   * @param {*} callback 
   */
	sendAddCommentNotificationToAssignee: (loggedInUserSlackId, loggedInUser, assigneeSlackId, ticket, project, callback) => {
		if (!assigneeSlackId) {
			return callback();
		}

		userService.getUserDetailsById(ticket.assigned_to, (err, userDetails) => {
			if (userDetails && loggedInUser !== ticket.assigned_to) {
				const text = unescape(`<@${loggedInUserSlackId}> Added a comment \n <${config.webUrl}/tickets/${project.slug}/${ticket.ticket_id}|${ticket.ticket_id} : ${ticket.summary}> \n ${ticket.comments}`)
				SlackService.sendMessage(assigneeSlackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
			}
		})
	},

	/**
	 * Send Add Comment NotificationTo Reviewer
	 * @param {*} loggedInUserSlackId 
	 * @param {*} loggedInUser 
	 * @param {*} reviewerSlackId 
	 * @param {*} ticket 
	 * @param {*} project 
	 * @param {*} callback 
	 * @returns 
	 */
	sendAddCommentNotificationToReviewer: (loggedInUserSlackId, loggedInUser, reviewerSlackId, ticket, project, callback) => {
		if (!reviewerSlackId) {
			return callback();
		}

		userService.getUserDetailsById(ticket.reviewer, (err, userDetails) => {
			if (userDetails && loggedInUser !== ticket.reviewer) {
				const text = unescape(`<@${loggedInUserSlackId}> Added a comment \n <${config.webUrl}/tickets/${project.slug}/${ticket.ticket_id}|${ticket.ticket_id} : ${ticket.summary}> \n ${ticket.comments}`);

				SlackService.sendMessage(reviewerSlackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
			}
		});
	},


	/**
	 * Send scheduler for no ticket activity notification
	 * 
	 * @param {*} activityEndTime
	 * @param {*} currentDateTime
	 * @param {*} overDueTime
	 * @param {*} name 
	 * @param {*} manager 
	 * @param {*} slackId 
	 * @param {*} callback 
	 */
	sendNoTicketActivityNotification: (activityEndTime, currentDateTime, overDueTime, name, manager, slackId, callback) => {

		if (slackId && activityEndTime < currentDateTime) {
			userService.getManagerDetailsById(manager, (err, userDetails) => {
				// Manager Slack Notification
				if (userDetails) {
					const { slack_id } = userDetails;

					if (slack_id) {
						const managerText = unescape(`${name} No in-progress activity/task for ${overDueTime}`);

						SlackService.sendMessage(slack_id, managerText, SLACK_MESSAGE_TYPE_BOT, () => callback());
					}
				}

				// User Slack Notification
				const text = unescape(`<@${slackId}> No in-progress activity/task for ${overDueTime}`);

				SlackService.sendMessage(slackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
			});
		} else {
			return callback();
		}
	},

	/**
	 * Send scheduler for task over due activity notification
	 * 
	 * @param {*} taskActivityTimeDelay
	 * @param {*} currentDateTime
	 * @param {*} ticket
	 * @param {*} project
	 * @param {*} notes
	 * @param {*} overDueTime
	 * @param {*} name 
	 * @param {*} manager 
	 * @param {*} slackId 
	 * @param {*} callback 
	 */
	sendTaskOverDueNotification: (taskActivityTimeDelay, currentDateTime, ticket, project, notes, overDueTime, name, manager, slackId, callback) => {


		if (slackId && taskActivityTimeDelay < currentDateTime) {
			userService.getManagerDetailsById(manager, (err, userDetails) => {
				// Manager Slack Notification
				if (userDetails) {
					const { slack_id } = userDetails;

					if (slack_id) {
						const managerText = unescape(`${name} Your activity/task is overdue for ${overDueTime} \n <${config.webUrl}/tickets/${project.slug}/${ticket.ticket_id}|${ticket.ticket_id} : ${notes}>`);

						SlackService.sendMessage(slack_id, managerText, SLACK_MESSAGE_TYPE_BOT, () => callback());
					}
				}

				// User Slack Notification
				const text = unescape(`<@${slackId}> Your activity/task is overdue for ${overDueTime} \n <${config.webUrl}/tickets/${project.slug}/${ticket.ticket_id}|${ticket.ticket_id} : ${notes}>`);

				SlackService.sendMessage(slackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
			});
		} else {
			return callback();
		}
	},

	/**
	 * Create and update in jira ticket notifications
	 * 
	 * @param {*} ticket_id 
	 * @param {*} ticket_url 
	 * @param {*} summary 
	 * @param {*} statusName 
	 * @param {*} slackId 
	 * @param {*} assigned_to_name 
	 * @param {*} callback 
	 */
	createAndUpdateInJiraTicketNotification: (ticket_id, ticket_url, summary, statusName, slackId, assigned_to_name, callback) => {

		const text = unescape(`${statusName} ticket assigned to you \n <${config.webUrl}/tickets/${ticket_url}|${ticket_id} : ${summary}>`);

		SlackService.sendMessage(slackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
	},

	/**
	 * Send Direct Slack Message To Ticket Assignee User
	 * 
	 * @param {*} ticket 
	 * @param {*} project 
	 * @param {*} user 
	 * @param {*} callback 
	 */
	sendTicketAssigneeChangedNotification: (loggedInUserSlackId, loggedInUser, ticket, user, callback) => {
		if (!user) {
			return callback();
		}

		let { slack_id, name, manager } = user;
		name = name || "";
		if (!slack_id) {
			return callback();
		}

		// Ticket Details
		const { assigned_to, assigned_to_name, type_name, status_name, ticket_url, ticket_id, summary } = ticket;

		userService.getUserDetailsById(assigned_to, (err, userDetails) => {
			userService.getManagerDetailsById(manager, (err, managerUserDetails) => {
				const ticketSummary = `[${type_name} - ${status_name}] <${config.webUrl}/tickets/${ticket_url}|${ticket_id} : ${summary}>`
				const text = unescape(`<@${loggedInUserSlackId}> Assigned ticket to you <@${slack_id}> \n ${ticketSummary}`);

				if (userDetails && loggedInUser !== assigned_to) {
					// Send Message As User
					SlackService.sendMessage(slack_id, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
				}

				const assigneeName = loggedInUser !== assigned_to ? assigned_to_name : "";

				// Send Slack Bot For Manager
				if (managerUserDetails && loggedInUser !== assigned_to) {
					const managerSlackId = managerUserDetails.slack_id;
					const ticketText = unescape(`Ticket assigned to ${assigneeName} \n ${ticketSummary}`);
					SlackService.sendMessage(managerSlackId, ticketText, SLACK_MESSAGE_TYPE_BOT, () => callback());
				}
			});
		})
	},

	/**
	 * Send Direct Slack Message To Ticket Status Changed Assignee User
	 * 
	 * @param {*} ticket 
	 * @param {*} project 
	 * @param {*} user 
	 * @param {*} callback 
	 */
	sendTicketStatusChangedNotification: (ticket, user, loggedInUserSlackId, callback) => {
		if (!user) {
			return callback();
		}

		let { slack_id, name } = user;
		name = name || "";

		if (!slack_id) {
			return callback();
		}

		const text = unescape(`<@${loggedInUserSlackId}> Changed ticket status \n  [${ticket.type_name} - ${ticket.status_name}] <${config.webUrl}/tickets/${ticket.ticket_url}|${ticket.ticket_id} : ${ticket.summary}>`);

		SlackService.sendMessage(slack_id, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
	},

	/**
	 * Send Direct Slack Message To Ticket Reporter
	 * 
	 * @param {*} ticket 
	 * @param {*} project 
	 * @param {*} user 
	 * @param {*} callback 
	 */
	sendReporterNotification: (loggedInUser, ticket, user, loggedInUserSlackId, callback) => {
		if (!user) {
			return callback();
		}

		let { slack_id, name } = user;
		name = name || "";

		if (!slack_id) {
			return callback();
		}

		const { type_name, status_name, ticket_url, ticket_id, summary, reported_by } = ticket;

		const text = unescape(`<@${loggedInUserSlackId}> Changed ticket status \n  [${type_name} - ${status_name}] <${config.webUrl}/tickets/${ticket_url}|${ticket_id} : ${summary}>`);

		userService.getUserDetailsById(reported_by, (err, userDetails) => {
			if (userDetails && loggedInUser !== reported_by) {
				// Send Message As User
				SlackService.sendMessage(slack_id, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
			}
		});
	},

	/**
	 * Send Direct Slack Message To Ticket Reviewer
	 * 
	 * @param {*} ticket 
	 * @param {*} project 
	 * @param {*} user 
	 * @param {*} callback 
	 */
	sendReviewerNotification: (loggedInUser, ticket, user, loggedInUserSlackId, callback,) => {
		let { slack_id, name } = user;
		name = name || "";

		if (!slack_id) {
			return callback();
		}

		const { type_name, status_name, ticket_url, ticket_id, summary, reviewer } = ticket;

		const text = unescape(`<@${loggedInUserSlackId}> Changed ticket status \n  [${type_name} - ${status_name}] <${config.webUrl}/tickets/${ticket_url}|${ticket_id} : ${summary}>`);

		userService.getUserDetailsById(reviewer, (err, userDetails) => {
			if (userDetails && loggedInUser !== reviewer) {
				// Send Message As User
				SlackService.sendMessage(slack_id, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
			}
		});
	},

	/**
	 * Send Direct Slack Message To Ticket Reviewer
	 * 
	 * @param {*} ticket 
	 * @param {*} project 
	 * @param {*} user 
	 * @param {*} callback 
	 */
	sendETAChangeNotification: async (ticket_id, requestUserId) => {

		let ticketTypeDetail;

		let statusDetail;

		let ticketDetail = await Ticket.findOne({
			where: { id: ticket_id }
		})

		if (!ticketDetail) {
			throw { message: "Ticket Not Found" }
		}

		const { id, assignee_id, company_id, eta, summary, type_id, status, ticket_number } = ticketDetail;

		let requestUserDetail = await UserService.getSlack(requestUserId, company_id);

		let assigneeDetail = await UserService.getSlack(assignee_id, company_id);

		let companyDetail = await CompanyService.getCompanyDetailById(company_id);

		if (type_id) {
			ticketTypeDetail = await ProjectTicketTypeService.getById(type_id, company_id)
		}

		if (status) {
			statusDetail = await StatusService.getData(status, company_id)
		}

		if (requestUserDetail && !requestUserDetail.slack_id) {
			throw { message: "Request User Slack Id Not Found" }
		}

		if (assigneeDetail && !assigneeDetail.slack_id) {
			throw { message: "Assignee User Slack Id Not Found" }
		}

		const formattedETA = eta ? `${utils.formatDate(eta, dateTime.formats.frontendDateFormat)}` : "";
		let projectDetail = await Project.findOne(({ where : { id: ticketDetail && ticketDetail?.project_id, company_id: company_id}}))

		const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail?.slug}/${ticket_number}|${ticket_number} : ${summary}>`

		const text = unescape(`<@${assigneeDetail.slack_id}> Your Ticket ETA changed to ${formattedETA} \n [${ticketTypeDetail ? `${ticketTypeDetail.name} -` : ""}${statusDetail.name}] ${ticketSummary}`);

		SlackService.sendMessageToUser(company_id, assigneeDetail && assigneeDetail?.slack_id, text)

	},

	/**
	 * Create and update in jira ticket notifications
	 *
	 * @param {*} slack_webhook_key
	 * @param {*} ticket_id
	 * @param {*} ticket_url
	 * @param {*} summary
	 * @param {*} slackName
	 * @param {*} callback
	 */
	setTicketETANotification: (ticket_id, ticket_url, summary, slack_id, assigned_to_name, callback) => {
		const text = unescape(`<@${slack_id}> What is your ETA for this ticket? Please update \n <${config.webUrl}/tickets/${ticket_url}|${ticket_id} : ${summary}>`);

		SlackService.sendMessage(slack_id, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
	},

	/**
	 * Send scheduler for no ticket in progress notification
	 *
	 * @param overDueTime
	 * @param userName
	 * @param slackWebhookKey
	 * @param callback
	 */
	sendNoTicketInprogressNotification: (overDueTime, slackId, callback) => {
		const text = unescape(`<@${slackId}> No in-progress ticket for ${overDueTime}`);

		SlackService.sendMessage(slackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
	},

	/**
	 * Ticket ReIndex Failed
	 *
	 * @param ticket_id
	 * @param ticket_url
	 * @param summary
	 * @param title
	 * @param callback
	 */
	ticketReIndexFailed: (ticket_id, ticket_url, summary, title, callback) => {
		if (!config.slack_channel_id) {
			return callback();
		}

		const text = unescape(`<${config.webUrl}/tickets/${ticket_url}|${ticket_id} : ${summary}> \n ${title}`);

		return SlackService.sendMessageToChannel(config.slack_channel_id, text, () => callback());
	},

	/**
	 * Ticket ReIndex Success
	 *
	 * @param slack_webhook_key
	 * @param callback
	 */
	ticketReIndexSuccess: (callback) => {
		if (!config.slack_channel_id) {
			return callback();
		}

		const text = unescape(`Successfully ReIndexed Tickets`);

		return SlackService.sendMessageToChannel(config.slack_channel_id, text, () => callback());
	},
	/**
* Send scheduler for no ticket activity notification
* 
* @param {*} overDueTime
* @param {*} name 
* @param {*} manager 
* @param {*} slackId 
* @param {*} callback 
*/
	sendNoCheckinActivityNotification: (overDueTime, slackId, callback) => {
		if (!slackId) {
			return callback();
		}
		// User Slack Notification
		const text = unescape(`<@${slackId}> Your check-in activity is overdue for ${overDueTime}`);

		SlackService.sendMessageAsBot(slackId, text, () => callback());

	},

	/**
* Send goal status notificaton
* 
* @param {*} activityEndTime
* @param {*} currentDateTime
* @param {*} overDueTime
* @param {*} name 
* @param {*} manager 
* @param {*} slackId 
* @param {*} callback 
*/
	sendGoalStatusNotification: (totalReportedTicketsStoryPoints, minimum_reported_tickets_story_points, manager, slackId, percentage, callback) => {
		if (slackId) {
			userService.getManagerDetailsById(manager, (err, userDetails) => {
				const { slack_id } = userDetails;
				// Manager Slack Notification
				if (userDetails && slack_id) {
					const managerText = unescape(`<@${slackId}> Today's Goal Status: ${percentage ? percentage > 100 ? 100 : percentage : 0}% achieved . (${totalReportedTicketsStoryPoints ? totalReportedTicketsStoryPoints : 0} out of ${minimum_reported_tickets_story_points} story points)`);
					SlackService.sendMessage(slack_id, managerText, SLACK_MESSAGE_TYPE_BOT, () => callback());
				}

				// User Slack Notification
				const text = unescape(`<@${slackId}> Your Today's Goal Status: ${percentage ? percentage : 0}% achieved . (${totalReportedTicketsStoryPoints ? totalReportedTicketsStoryPoints : 0} out of ${minimum_reported_tickets_story_points} story points)`);
				SlackService.sendMessage(slackId, text, SLACK_MESSAGE_TYPE_BOT, () => callback());
			});
		} else {
			return callback();
		}

	},

	sendTicketAssigneeNotification: async (ticket_id, reporter_id,oldAssignee_id) => {
try{
		let ticketTypeDetail;

		let statusDetail;

		let ticketDetail = await Ticket.findOne({
			where: { id: ticket_id }
		})

		if (!ticketDetail) {
			throw { message: "Ticket Not Found" }
		}

		const { assignee_id, company_id, summary, type_id, status, ticket_number,eta } = ticketDetail;

		if (type_id) {
			ticketTypeDetail = await ProjectTicketTypeService.getById(type_id, company_id)
		}

		if (status) {
			statusDetail = await StatusService.getData(status, company_id)
		}

		let reporterDetail;
		if(reporter_id){
			 reporterDetail = await UserService.getSlack(reporter_id, company_id);
		}
		let projectDetail = await Project.findOne(({ where : { id: ticketDetail && ticketDetail?.project_id, company_id: company_id}}))

		let newAssignee = await UserService.getSlack(assignee_id, company_id);

		let oldAssignee;
		if(oldAssignee_id){
		 oldAssignee = await UserService.getSlack(oldAssignee_id, company_id);
		}

		let companyDetail = await CompanyService.getCompanyDetailById(company_id);
		if (companyDetail) {
			const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail && projectDetail?.slug}/${ticket_number}|${ticket_number} : ${summary}>`
			const text = unescape(`<@${newAssignee && newAssignee.slack_id}> Ticket assigned to you \n [ETA: ${DateTime.shortMonthDate(eta)}] ${ticketSummary}`);
			SlackService.sendMessageToUser(company_id, newAssignee && newAssignee?.slack_id, text)
		}

		if (oldAssignee) {
			const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail && projectDetail?.slug}/${ticket_number}|${ticket_number} : ${summary}>`
			const text = unescape(`<@${oldAssignee && oldAssignee?.slack_id}> Ticket unAssigned from you \n [${ticketTypeDetail ? `${ticketTypeDetail.name} -` : ""} ${statusDetail && statusDetail.name}] ${ticketSummary}`);
			SlackService.sendMessageToUser(company_id, oldAssignee && oldAssignee?.slack_id, text)
		}

	}catch(err){
		console.log(err);
	}

		
	},

	sendTicketDeletedNotification: async (assignee_id, ticket_id ,company_id ,ticket_summary) => {
		try {
			// Retrieve assignee details
			const assignee = await UserService.getSlack(assignee_id ,company_id);
	
			if (assignee) {
				const text = unescape(`<@${assignee.slack_id}>  Ticket has been deleted.\n ${ticket_id} : ${ticket_summary} `);
	
				// Send notification
				SlackService.sendMessageToUser(company_id, assignee && assignee?.slack_id, text)
			}
		} catch (error) {
			console.log("Error sending notification:",error);
		}
	},

	sendTicketStatusChangeNotification: async ({ project_id, company_id, assignee_id, ticket_number, summary, statusName }) => {
		let projectDetail = await Project.findOne(({ where: { id: project_id, company_id: company_id } }))
		let companyDetail = await CompanyService.getCompanyDetailById(company_id);
		let assigneeDetail = await UserService.getSlack(assignee_id, company_id);

		const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail?.slug}/${ticket_number}|${ticket_number} : ${summary}>`

		const text = unescape(`<@${assigneeDetail.slack_id}> Your Ticket Status Changed To ${statusName} \n ${ticketSummary}`);
		SlackService.sendMessageToUser(company_id, assigneeDetail && assigneeDetail?.slack_id, text)
	},


	sendTicketAssigneePushNotification: async (ticket_id, oldAssignee_id, req) => {
		const companyId = Request.GetCompanyId(req);
		let ticketTypeDetail;

		let statusDetail;

		let params = {
			query: {
				ticket_id: ticket_id,
				pagination: false,
			},
			user: {
				company_id: companyId,
				role: req.user.role
			}
		}

		let ticketDetail = await TicketService.search(params)
		if (!ticketDetail?.data[0]) {
			throw { message: "Ticket Not Found" }
		}

		const { assignee_id, summary, ticketTypeId, statusId, ticket_number, eta } = ticketDetail?.data[0];

		if (ticketTypeId) {
			ticketTypeDetail = await ProjectTicketTypeService.getById(ticketTypeId, companyId)
		}

		if (statusId) {
			statusDetail = await StatusService.getData(statusId, companyId)
		}

		let newAssigneeDetail = await UserService.get(assignee_id, companyId)
		let oldAssigneeDetail
		if (oldAssignee_id) {
			oldAssigneeDetail = await UserService.get(oldAssignee_id, companyId)
		}

		let assignParam = {
			token: newAssigneeDetail?.push_token,
			title: ` Ticket assigned to you \n [ETA: ${DateTime.shortMonthDate(eta)}]`,
			message: `${ticket_number} : ${summary}`
		}
		let unAssignParam = {
			token: oldAssigneeDetail?.push_token,
			title: `Ticket unAssigned from you \n [${ticketTypeDetail ? `${ticketTypeDetail.name} -` : ""} ${statusDetail && statusDetail.name}]`,
			message: `${ticket_number} : ${summary}`
		}
		await NotificationService.sendPushNotification(assignParam, { isTicketDetailScreen: true, item: ticketDetail?.data[0] })
		if (oldAssignee_id) {
			await NotificationService.sendPushNotification(unAssignParam, { isTicketDetailScreen: true, item: ticketDetail?.data[0] })
		}
	}


};
