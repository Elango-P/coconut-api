const utils = require("../../lib/utils");

function processPoaDetails(ticket, poa) {
	return {
		id: ticket.id,
		ticketId: ticket.ticket_id,
		ticketUrl: ticket.ticket_url,
		parentTicketId: ticket.parent_ticket_id,
		parentTicketUrl: ticket.parent_ticket_url,
		jiraTicketUrl: ticket.jira_ticket_url,
		trelloTicketUrl: ticket.trello_ticket_url,
		externalTicketId: ticket.external_ticket_id,
		summary: utils.rawURLDecode(ticket.summary),
		description: utils.rawURLDecode(ticket.description),
		details: poa ? poa.details : null,
		attachments: poa ? poa.attachments : null,
		updatedBy: poa ? poa.updated_by : null
	};
};

module.exports = processPoaDetails;
