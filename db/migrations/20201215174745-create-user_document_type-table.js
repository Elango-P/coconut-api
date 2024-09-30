"use strict";
exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating user_document_type table");

		// Defining whether the user_document_type table already exist or not.
		const userDocumentTypeTableExists = await queryInterface.tableExists("user_document_type");

		// Condition for creating the user_document_type table only if the table doesn't exist already.
		if (!userDocumentTypeTableExists) {
			await queryInterface.createTable("user_document_type", {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				document_type: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				status: {
					type: Sequelize.STRING,
					allowNull: true
				},
				company_id : {
					type: Sequelize.INTEGER,
					allowNull: true
				}
			});
		};
	} catch (err) {
		console.log(err);
	};
};

exports.down = async function down(queryInterface) {
	try {
		// Defining whether the user_document_type table already exist or not.
		const userDocumentTypeTableExists = await queryInterface.tableExists("user_document_type");
  
		// Condition for dropping the user_document_type table only if the table exist already.
		if (userDocumentTypeTableExists) {
		  await queryInterface.dropTable("user_document_type");
		};
	} catch (err) {
		console.log(err);
	};
};
