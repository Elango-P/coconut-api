"use strict";
exports.up = async function up(queryInterface, Sequelize) {
    try {
        // Console log
        console.log("Creating jira_project_ticket_type table");

        // Defining whether the jira_project_ticket_type table already exist or not.
        const jiraProjectTicketTypeTableExists = await queryInterface.tableExists("jira_project_ticket_type");

        // Condition for creating the jira_project_ticket_type table only if the table doesn't exist already.
        if (!jiraProjectTicketTypeTableExists) {
            await queryInterface.createTable("jira_project_ticket_type", {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                project_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                project_ticket_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                jira_project_ticket_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                company_id : {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: true,
                    type: Sequelize.DATE,
                },
                deletedAt: {
                    allowNull: true,
                    type: Sequelize.DATE,
                },
            });
        };
    } catch (err) {
        console.log(err);
    };
};

exports.down = async function down(queryInterface) {
    try {
        // Defining whether the jira_project_ticket_type table already exist or not.
        const jiraProjectTicketTypeTableExists = await queryInterface.tableExists("jira_project_ticket_type");
  
        // Condition for dropping the jira_project_ticket_type table only if the table exist already.
        if (jiraProjectTicketTypeTableExists) {
          await queryInterface.dropTable("jira_project_ticket_type");
        };
    } catch (err) {
        console.log(err);
    };
};