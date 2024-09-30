"use strict";

const sequelize = require("sequelize");

exports.up = function up(queryInterface, Sequelize) {
	return queryInterface.createTable("payment", {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		date: {
			type: Sequelize.DATEONLY,
			allowNull: true,
		},
		amount: {
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
		status: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		company_id: {
			allowNull: false,
			type: Sequelize.INTEGER,
		},
		
		owner_id: {
			allowNull: true,
			type: Sequelize.INTEGER,
		},
		payment_account_id: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		account_id: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		bill_id: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		created_by: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		  notes: {
			type: Sequelize.STRING,
			allowNull: true,
		  },
		 due_date: {
			type: Sequelize.DATEONLY,
			allowNull: true,
		},
		invoice_number: {
			type: Sequelize.STRING,
			allowNull: true,
		},
	});
};

exports.down = function down(queryInterface) {
	return queryInterface.dropTable("payment");
};
