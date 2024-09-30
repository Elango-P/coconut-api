"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating invoice table");

      // Defining whether the invoice table already exist or not.
      const saleInvoiceExists = await queryInterface.tableExists(
        "invoice"
      );

      // Condition for creating the invoice table only if the table doesn't exist already.
      if (!saleInvoiceExists) {
        await queryInterface.createTable("invoice", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          invoice_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          total_amount: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          order_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          customer_account: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
        
          sales_executive_user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          delivery_executive: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          shift: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          customer_phone_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          type: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          uuid: {
            type: Sequelize.UUID,
            allowNull: true,
            defaultValue: Sequelize.UUIDV4,
          },
          payment_type: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          createdBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          total_cgst_amount: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          },
          total_sgst_amount: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          },
          cash_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          upi_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          cancelled_at: {
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
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the invoice table already exist or not.
      const saleInvoiceExists = await queryInterface.tableExists(
        "invoice"
      );

      // Condition for dropping the invoice table only if the table exist already.
      if (saleInvoiceExists) {
        await queryInterface.dropTable("invoice");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
