"use strict";
exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating ticket_link table");

		// Defining whether the ticket_link table already exist or not.
		const ticketLinkTableExists = await queryInterface.tableExists("ticket_link");

		// Condition for creating the ticket_link table only if the table doesn't exist already.
		if (!ticketLinkTableExists) {
			await queryInterface.createTable("ticket_link", {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				ticket_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				linked_ticket_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				type: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				excluded: {
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
		// Defining whether the ticket_link table already exist or not.
		const ticketLinkTableExists = await queryInterface.tableExists("ticket_link");
  
		// Condition for dropping the ticket_link table only if the table exist already.
		if (ticketLinkTableExists) {
		  await queryInterface.dropTable("ticket_link");
		};
	} catch (err) {
		console.log(err);
	};
};
