"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating app table");

      // Defining whether the app table already exist or not.
      const appTableExists = await queryInterface.tableExists("app");

      // Condition for creating the app table only if the table doesn't exist already.
      if (!appTableExists) {
        await queryInterface.createTable("app", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the app table already exist or not.
      const appTableExists = await queryInterface.tableExists("app");

      // Condition for dropping the app table only if the table exist already.
      if (appTableExists) {
        await queryInterface.dropTable("app");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
