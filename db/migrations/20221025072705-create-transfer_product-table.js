"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating transfer_product table");

      // Defining whether the transfer_product table already exist or not.
      const transferProductTableExists = await queryInterface.tableExists("transfer_product");

      // Condition for creating the transfer_product table only if the table doesn't exist already.
      if (!transferProductTableExists) {
        await queryInterface.createTable("transfer_product", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          transfer_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
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
          product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          from_store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          to_store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          type: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          unit_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          reason_id: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          created_by: {
            type: Sequelize.INTEGER,
            allowNull: true
          }
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the transfer_product table already exist or not.
      const transferProductTableExists = await queryInterface.tableExists("transfer_product");

      // Condition for dropping the transfer_product table only if the table exist already.
      if (transferProductTableExists) {
        await queryInterface.dropTable("transfer_product");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
