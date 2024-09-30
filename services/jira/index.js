const getIssues = require("./getIssues");
const syncTickets = require("./syncTickets");
const syncTicketsRelease = require("./syncTicketsRelease");
const syncReleases = require("./syncReleases");
const updateJIRAAssignee = require("./updateJIRAAssignee");
const updateJIRAStatus = require("./updateJIRAStatus");
const syncSprints = require("./syncSprints");
const getSprintIssues = require("./getSprintIssues");
const syncSprintsTickets = require("./syncSprintsTickets");
const getAuth = require("./getAuth");
const getBoardIssues = require("./getBoardIssues");

module.exports = {
	getIssues, syncTickets, syncTicketsRelease, syncReleases, updateJIRAAssignee, updateJIRAStatus, syncSprints, getSprintIssues, syncSprintsTickets, getAuth, getBoardIssues
};
