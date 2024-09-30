"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating order_product Table");

      // Defining whether the order_product table already exist or not.
      const orderProductTableExists = await queryInterface.tableExists("order_product");

      // Condition for creating the order_product table only if the table doesn't exist already.
      if (!orderProductTableExists) {
        await queryInterface.createTable("order_product", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          order_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          product_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          unit_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          price: {
            type: Sequelize.DECIMAL,
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
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          order_number: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          order_date: {
            allowNull: true,
            type: Sequelize.DATEONLY,
          },
          cancelled_at : {
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
          status: {
            type: Sequelize.INTEGER,
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
          manual_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
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
      // Defining whether the order_product table already exist or not.
      const orderProductTableExists = await queryInterface.tableExists("order_product");

      // Condition for dropping the order_product table only if the table exist already.
      if (orderProductTableExists) {
        await queryInterface.dropTable("order_product");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
