"use strict";
exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating user_temperature table");

		// Defining whether the user_temperature table already exist or not.
		const userTemperatureTableExists = await queryInterface.tableExists("user_temperature");

		// Condition for creating the user_temperature table only if the table doesn't exist already.
		if (!userTemperatureTableExists) {
			await queryInterface.createTable("user_temperature", {
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
				date: {
					type: Sequelize.DATEONLY,
					allowNull: false,
				},
				temperature: {
					type: Sequelize.STRING,
					allowNull: false
				},
				image: {
					type: Sequelize.TEXT,
					allowNull: false
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
		// Defining whether the user_temperature table already exist or not.
		const userTemperatureTableExists = await queryInterface.tableExists("user_temperature");
  
		// Condition for dropping the user_temperature table only if the table exist already.
		if (userTemperatureTableExists) {
		  await queryInterface.dropTable("user_temperature");
		};
	} catch (err) {
		console.log(err);
	};
};
