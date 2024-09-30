"use strict";

exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating purchase table");

		// Defining whether the bill table already exist or not.
		const purchaseTableExists = await queryInterface.tableExists("purchase");

		// Condition for creating the bill table only if the table doesn't exist already.
		if (!purchaseTableExists) {
			await queryInterface.createTable("purchase", {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				purchase_number: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				purchase_date: {
					type: Sequelize.DATEONLY,
					allowNull: true,
				},
				description: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				amount: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				file: {
					type: Sequelize.STRING,
					allowNull: true
				},
				store_id: {
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
				status: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				order_number: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				payment_type: {
					type: Sequelize.STRING,
					allowNull: true
				},
				payment_term: {
					type: Sequelize.STRING,
					allowNull: true
				},
				company_id : {
					allowNull :false,
					type: Sequelize.INTEGER,
				},
				vendor_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				vendor_invoice_number: {
					type: Sequelize.STRING,
					allowNull: true,
				},
				net_amount: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				discount_amount: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				tax_amount: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				discrepancy_amount: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				owner_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				bill_id: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				notes: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				vendor_invoice_date: {
					type: Sequelize.DATEONLY,
					allowNull: true,
				},
				due_date: {
					type: Sequelize.DATEONLY,
					allowNull: true,
				},
				returned_items_amount: {
					type: Sequelize.NUMERIC,
					allowNull: true
				},
				other_deduction_amount: {
					type: Sequelize.NUMERIC,
					allowNull: true
				},
				cash_discount_percentage: {
					type: Sequelize.NUMERIC,
					allowNull: true
				},
				cash_discount_amount: {
					type: Sequelize.NUMERIC,
					allowNull: true
				},
				invoice_amount: {
					type: Sequelize.NUMERIC,
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
		// Defining whether the bill table already exist or not.
		const purchaseTableExists = await queryInterface.tableExists("purchase");
  
		// Condition for dropping the bill table only if the table exist already.
		if (purchaseTableExists) {
		  await queryInterface.dropTable("purchase");
		};
	} catch (err) {
		console.log(err);
	};
};
