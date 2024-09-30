function processJiraProjectTicketType(result) {
    const jiraProjectTicketType = result.get();

    const data = {
        id: jiraProjectTicketType.id,
        projectId: jiraProjectTicketType.project_id,
        projectTicketTypeId: jiraProjectTicketType.project_ticket_type_id,
        jiraProjectTicketTypeId: jiraProjectTicketType.jira_project_ticket_type_id,
        projectTicketTypeName: jiraProjectTicketType.projectTicketType ? jiraProjectTicketType.projectTicketType.name : ""
    };

    return data;
}

module.exports = processJiraProjectTicketType;