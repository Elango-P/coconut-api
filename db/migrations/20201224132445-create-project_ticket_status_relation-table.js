"use strict";
exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating project_ticket_status_relation table");

		// Defining whether the project_ticket_status_relation table already exist or not.
		const projectTicketStatusRelationTableExists = await queryInterface.tableExists("project_ticket_status_relation");

		// Condition for creating the project_ticket_status_relation table only if the table doesn't exist already.
		if (!projectTicketStatusRelationTableExists) {
			await queryInterface.createTable("project_ticket_status_relation", {
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
				project_ticket_status_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				project_ticket_next_status_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				sort: {
					type: Sequelize.DECIMAL,
					allowNull: true,
					defaultValue: 0.00
				},
				company_id : {
					type: Sequelize.INTEGER,
					allowNull: false
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
		// Defining whether the project_ticket_status_relation table already exist or not.
		const projectTicketStatusRelationTableExists = await queryInterface.tableExists("project_ticket_status_relation");
  
		// Condition for dropping the project_ticket_status_relation table only if the table exist already.
		if (projectTicketStatusRelationTableExists) {
		  await queryInterface.dropTable("project_ticket_status_relation");
		};
	} catch (err) {
		console.log(err);
	};
};
