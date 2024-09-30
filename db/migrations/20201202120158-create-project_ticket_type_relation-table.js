"use strict";
exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating project_ticket_type_relation table");

		// Defining whether the project_ticket_type_relation table already exist or not.
		const projectTicketTypeRelationTableExists = await queryInterface.tableExists("project_ticket_type_relation");

		// Condition for creating the project_ticket_type_relation table only if the table doesn't exist already.
		if (!projectTicketTypeRelationTableExists) {
			await queryInterface.createTable("project_ticket_type_relation", {
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
				project_child_ticket_type_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				company_id : {
					type: Sequelize.INTEGER,
					allowNull: false,
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
		// Defining whether the project_ticket_type_relation table already exist or not.
		const projectTicketTypeRelationTableExists = await queryInterface.tableExists("project_ticket_type_relation");
  
		// Condition for dropping the project_ticket_type_relation table only if the table exist already.
		if (projectTicketTypeRelationTableExists) {
		  await queryInterface.dropTable("project_ticket_type_relation");
		};
	} catch (err) {
		console.log(err);
	};
};
