const Trello = require("node-trello");

// Config
const config = require("../../lib/config");

// Utils
const utils = require("../../lib/utils");

// jira
const jira = require("../../lib/jira");

const trello = module.exports = {
	/**
	 * Get Token
	 * 
	 * @param {*} token 
	 * @returns 
	 */
	get: (token) => new Trello(config.trelloAppKey, token),

	/**
	 * Get the list boards available in trello
	 * 
	 * @param {*} token 
	 * @param {*} callback 
	 */
	getBoards: (token, callback) => {
		const trelloAuth = trello.get(token);

		trelloAuth.get("/1/members/me/boards", callback);
	},

	/**
	 * Get list on a boards by board id
	 * 
	 * @param {*} token 
	 * @param {*} boardId 
	 * @param {*} callback 
	 */
	getListByBoardId: (token, boardId, callback) => {
		const trelloAuth = trello.get(token);

		trelloAuth.get(`/1/boards/${boardId}/lists`, callback);
	},

	/**
	 * Get all the cards by trello board id
	 * 
	 * @param {*} token 
	 * @param {*} boardId 
	 * @param {*} callback 
	 */
	getCardsByBoardId: (token, boardId, callback) => {
		const trelloAuth = trello.get(token);

		trelloAuth.get(`/1/boards/${boardId}/cards`, callback);
	},

	/**
	 * Create a new card on a board list by list id
	 * 
	 * @param {*} token 
	 * @param {*} listId 
	 * @param {*} data 
	 * @param {*} callback 
	 */
	createNewCard: (token, listId, data, callback) => {
		const trelloAuth = trello.get(token);

		trelloAuth.post("/1/cards", { idList: listId, name: data.summary, desc: data.description }, callback);
	},

	/**
	 * Create attachment on a card
	 * 
	 * @param {*} token 
	 * @param {*} cardId 
	 * @param {*} attachment 
	 * @param {*} callback 
	 */
	createAttachmentOnCard: (token, cardId, attachment, callback) => {
		const trelloAuth = trello.get(token);

		trelloAuth.post(`/1/cards/${cardId}/attachments`, { url: attachment.url, name: attachment.summary }, callback);
	},

	/**
	 * Formatted description
	 * 
	 * @param {*} projectId 
	 * @param {*} ticketDetail 
	 * @param {*} ticketAttachments 
	 * @returns 
	 */
	formatDescription: (projectId, ticketDetail, ticketAttachments) => {
		let description = jira.formatText(utils.rawURLDecode(ticketDetail.description));

		if (ticketDetail.acceptanceCriteria) {
			description += "\r\n";
			description += "\r\n";
			description += "**Acceptance Criteria:**";
			description += "\r\n";
			description += jira.formatText(utils.rawURLDecode(ticketDetail.acceptanceCriteria));
			description += "\r\n";
		}

		if (ticketDetail.userImpact) {
			description += "\r\n";
			description += "\r\n";
			description += "**User Impact:**";
			description += "\r\n";
			description += utils.rawURLDecode(ticketDetail.userImpact);
			description += "\r\n";
		}

		if (ticketDetail.productionStatus) {
			let productionStatusNotes = ticketDetail.productionStatusNotes;
			productionStatusNotes = productionStatusNotes ? `: ${productionStatusNotes}` : "";
			description += "\r\n";
			description += "\r\n";
			description += "**Issue Status In Production:**";
			description += "\r\n";
			description += `${ticketDetail.productionStatus} ${productionStatusNotes}`;
			description += "\r\n";
		}

		if (ticketDetail.environment) {
			description += "\r\n";
			description += "\r\n";
			description += "**Environment:**";
			description += "\r\n";
			description += utils.rawURLDecode(ticketDetail.environment);
			description += "\r\n";
		}

		if (ticketDetail.buildNumber) {
			description += "\r\n";
			description += "\r\n";
			description += "**Build:**";
			description += "\r\n";
			description += ticketDetail.buildNumber;
			description += "\r\n";
		}

		if (ticketDetail.testStep) {
			description += "\r\n";
			description += "\r\n";
			description += "**Test Steps:**";
			description += "\r\n";
			description += jira.formatText(utils.rawURLDecode(ticketDetail.testStep));
			description += "\r\n";
		}

		if (ticketDetail.actualResults) {
			description += "\r\n";
			description += "\r\n";
			description += "**Actual Results:**";
			description += "\r\n";
			description += utils.rawURLDecode(ticketDetail.actualResults);
			description += "\r\n";
		}

		if (ticketDetail.expectedResults) {
			description += "\r\n";
			description += "\r\n";
			description += "**Expected Results:**";
			description += "\r\n";
			description += utils.rawURLDecode(ticketDetail.expectedResults);
			description += "\r\n";
		}

		if (ticketAttachments.length > 0) {
			description += "\r\n";
			description += "\r\n";
			description += "**Reference ScreenShots:**";
			description += "\r\n";
			ticketAttachments.forEach((ticketAttachment, index) => {
				description += "\r\n";
				description += `**${index + 1}. ${ticketAttachment.summary}**`;
				description += "\r\n";
				description += `![](${ticketAttachment.url})`;
				description += "\r\n";
			});
		}

		return description;
	}
};
