"use strict";
exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating user_document table");

		// Defining whether the user_document table already exist or not.
		const userDocumentTableExists = await queryInterface.tableExists("user_document");

		// Condition for creating the user_document table only if the table doesn't exist already.
		if (!userDocumentTableExists) {
			await queryInterface.createTable("user_document", {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				user_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				document_type: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				document_url: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				status: {
					type: Sequelize.STRING,
					allowNull: true
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
		// Defining whether the user_document table already exist or not.
		const userDocumentTableExists = await queryInterface.tableExists("user_document");
  
		// Condition for dropping the user_document table only if the table exist already.
		if (userDocumentTableExists) {
		  await queryInterface.dropTable("user_document");
		};
	} catch (err) {
		console.log(err);
	};
};
