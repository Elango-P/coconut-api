"use strict";

exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating salary table");

		// Defining whether the salary table already exist or not.
		const salaryTableExists = await queryInterface.tableExists("salary");

		// Condition for creating the salary table only if the table doesn't exist already.
		if (!salaryTableExists) {
			await queryInterface.createTable("salary", {
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
				working_days: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				worked_days: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				additional_days: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				basic: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				gratuity: {
					type: Sequelize.DECIMAL,
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
				hra: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				leave: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				absent: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				medical_insurance: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				net_salary: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				company_id: {
					allowNull: false,
					type: Sequelize.INTEGER,
				},
				professional_tax: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				special_allowance: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				standard_allowance: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				unPaid_leaves: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				salary_number: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				monthly_salary: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				bonus: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				salary_per_day: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				tds: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				provident_fund: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				other_deductions: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				leave_salary: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				additional_day_allowance: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				status: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				fine: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				additional_hours: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				additional_hours_salary: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				month: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				year: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				notes: {
					type: Sequelize.STRING,
					allowNull: true
				},
				worked_days_salary: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				other_allowance: {
					type: Sequelize.DECIMAL,
					allowNull: true,
				},
				attendance_count: {
					type: Sequelize.TEXT,
					allowNull: true,
				},
				

			});
		};
	} catch (err) {
		console.log(err);
	};

};

exports.down = async function down(queryInterface) {
	try {
		// Defining whether the salary table already exist or not.
		const salaryTableExists = await queryInterface.tableExists("salary");

		// Condition for dropping the salary table only if the table exist already.
		if (salaryTableExists) {
			await queryInterface.dropTable("salary");
		};
	} catch (err) {
		console.log(err);
	};
};
