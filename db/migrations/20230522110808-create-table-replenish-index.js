'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating replenish index");

      // Defining whether the product_price table already exist or not.
      const fineTableExists = await queryInterface.tableExists("replenish_index");

      // Condition for creating the product_price table only if the table doesn't exist already.
      if (!fineTableExists) {
        await queryInterface.createTable("replenish_index", {
          id: {
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER,
          },
          product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          store_count: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          status: {
            type: Sequelize.INTEGER,
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
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the product_price table already exist or not.
      const fineTableExists = await queryInterface.tableExists("replenish_index");

      // Condition for dropping the product_price table only if the table exist already.
      if (fineTableExists) {
        await queryInterface.dropTable("replenish_index");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
