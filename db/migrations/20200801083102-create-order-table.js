"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating order table");

      // Defining whether the order table already exist or not.
      const orderTableExists = await queryInterface.tableExists("order");

      // Condition for creating the order table only if the table doesn't exist already.
      if (!orderTableExists) {
        await queryInterface.createTable("order", {
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
          total_amount: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          },
          store_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
          uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
          },
          order_number: {
            type: Sequelize.BIGINT,
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
          shift: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          createdBy: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          payment_type: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          cash_amount: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          },
          upi_amount: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          },
          total_cgst_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          total_sgst_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          cancelled_at: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          customer_phone_number: {
            allowNull: true,
            type: Sequelize.STRING,
          },
          type: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          owner: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          reason: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the order table already exist or not.
      const orderTableExists = await queryInterface.tableExists("order");

      // Condition for dropping the order table only if the table exist already.
      if (orderTableExists) {
        await queryInterface.dropTable("order");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
