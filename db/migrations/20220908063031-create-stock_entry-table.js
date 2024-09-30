'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating stock_entry table");

      // Defining whether the stock_entry table already exist or not.
      const stockEntryTableExists = await queryInterface.tableExists("stock_entry");

      // Condition for creating the stock_entry table only if the table doesn't exist already.
      if (!stockEntryTableExists) {
        await queryInterface.createTable("stock_entry", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          date: {
            type: Sequelize.DATEONLY, 
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          system_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          owner_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          stock_entry_number: {
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
      // Defining whether the stock_entry table already exist or not.
      const stockEntryTableExists = await queryInterface.tableExists("stock_entry");

      // Condition for dropping the stock_entry table only if the table exist already.
      if (stockEntryTableExists) {
        await queryInterface.dropTable("stock_entry");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
