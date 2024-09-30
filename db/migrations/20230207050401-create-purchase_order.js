"use strict";

exports.up = async function up(queryInterface, Sequelize) {
	try {
		// Console log
		console.log("Creating purchase_order table");

		// Defining whether the purchase_order table already exist or not.
		const purchaseOrderTableExists = await queryInterface.tableExists("purchase_order");

		// Condition for creating the purchase_order table only if the table doesn't exist already.
		if (!purchaseOrderTableExists) {
			await queryInterface.createTable("purchase_order", {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				purchase_order_number: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				vendor_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				date: {
					type: Sequelize.DATEONLY,
					allowNull: true,
				},
				amount: {
					type: Sequelize.DECIMAL,
					allowNull: true
				},
				delivery_date: {
					type: Sequelize.DATEONLY,
					allowNull: true,
				},
				status: {
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
				company_id: {
					allowNull: false,
					type: Sequelize.INTEGER,
				},
				owner_id: {
					allowNull: true,
					type: Sequelize.INTEGER,
				},

				billing_address_id: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				delivery_address_id: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				description: {
					type: Sequelize.STRING,
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
		// Defining whether the purchase_order table already exist or not.
		const purchaseOrderTableExists = await queryInterface.tableExists("purchase_order");

		// Condition for dropping the purchase_order table only if the table exist already.
		if (purchaseOrderTableExists) {
			await queryInterface.dropTable("purchase_order");
		};
	} catch (err) {
		console.log(err);
	};
};
