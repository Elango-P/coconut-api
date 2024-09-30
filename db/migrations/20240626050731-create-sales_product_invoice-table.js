"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating invoice_product Table");

      // Defining whether the invoice_product table already exist or not.
      const isExists = await queryInterface.tableExists(
        "invoice_product"
      );

      // Condition for creating the invoice_product table only if the table doesn't exist already.
      if (!isExists) {
        await queryInterface.createTable("invoice_product", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          invoice_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          unit_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          invoice_date: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          cost_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          profit_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          mrp: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          cgst_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          cgst_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          sgst_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          sgst_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          taxable_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          invoice_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          cancelled_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          reward: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          manual_price: {
            type: Sequelize.DECIMAL,
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
          order_product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the invoice_product table already exist or not.
      const isExists = await queryInterface.tableExists(
        "invoice_product"
      );

      // Condition for dropping the invoice_product table only if the table exist already.
      if (isExists) {
        await queryInterface.dropTable("invoice_product");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
