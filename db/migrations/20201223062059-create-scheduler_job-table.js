"use strict";
exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating scheduler_job table");

		// Defining whether the scheduler_job table already exist or not.
		const schedulerJobTableExists = await queryInterface.tableExists("scheduler_job");

		// Condition for creating the scheduler_job table only if the table doesn't exist already.
		if (!schedulerJobTableExists) {
			await queryInterface.createTable("scheduler_job", {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				name: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				job_name: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				interval: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				api_url: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				notes: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				completed_at: {
					type: Sequelize.DATE,
					allowNull: true,
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
				company_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				started_at: {
					type: Sequelize.DATE,
					allowNull: true,
				},
				status: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				start_time: {
					type: Sequelize.DATE,
					allowNull: true,
				},
				to_email: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				to_slack: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				portal_id: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				start_date: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				end_date: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
			});
		};
	} catch (err) {
		console.log(err);
	};
};

exports.down = async function down(queryInterface) {
	try {
		// Defining whether the scheduler_job table already exist or not.
		const schedulerJobTableExists = await queryInterface.tableExists("scheduler_job");

		// Condition for dropping the scheduler_job table only if the table exist already.
		if (schedulerJobTableExists) {
			await queryInterface.dropTable("scheduler_job");
		};
	} catch (err) {
		console.log(err);
	};
};
