"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating account_product table");

      // Defining whether the account_product table already exist or not.
      const accountProductTableExists = await queryInterface.tableExists("account_product");

      // Condition for creating the account_product table only if the table doesn't exist already.
      if (!accountProductTableExists) {
        await queryInterface.createTable("account_product", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },

          account_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },

          product_id: {
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
         
        
          margin_percentage: {
            type: Sequelize.NUMERIC,
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
      // Defining whether the account_product table already exist or not.
      const accountProductTableExists = await queryInterface.tableExists("account_product");

      // Condition for dropping the account_product table only if the table exist already.
      if (accountProductTableExists) {
        await queryInterface.dropTable("account_product");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
