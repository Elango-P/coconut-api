'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating stock_entry_product table");

      // Defining whether the stock_entry_product table already exist or not.
      const stockEntryProductTableExists = await queryInterface.tableExists("stock_entry_product");

      // Condition for creating the stock_entry_product table only if the table doesn't exist already.
      if (!stockEntryProductTableExists) {
        await queryInterface.createTable("stock_entry_product", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          stock_entry_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          store_product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          owner_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          system_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
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
      // Defining whether the stock_entry_product table already exist or not.
      const stockEntryProductTableExists = await queryInterface.tableExists("stock_entry_product");

      // Condition for dropping the stock_entry_product table only if the table exist already.
      if (stockEntryProductTableExists) {
        await queryInterface.dropTable("stock_entry_product");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
