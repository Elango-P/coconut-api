'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating pages table");

      // Defining whether the pages table already exist or not.
      const pagesTableExists = await queryInterface.tableExists("pages");

      // Condition for creating the pages table only if the table doesn't exist already.
      if (!pagesTableExists) {
        await queryInterface.createTable("pages", {
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
          url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          content: {
            type: Sequelize.TEXT,
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
      // Defining whether the pages table already exist or not.
      const pagesTableExists = await queryInterface.tableExists("pages");

      // Condition for dropping the pages table only if the table exist already.
      if (pagesTableExists) {
        await queryInterface.dropTable("pages");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
