"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating slack table");

      // Defining whether the slack table already exist or not.
      const tagTableExists = await queryInterface.tableExists("slack");

      // Condition for creating the slack table only if the table doesn't exist already.
      if (!tagTableExists) {
        await queryInterface.createTable("slack", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          object_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          object_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          slack_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          slack_id: {
            type: Sequelize.STRING,
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
      // Defining whether the slack table already exist or not.
      const tagTableExists = await queryInterface.tableExists("slack");

      // Condition for dropping the slack table only if the table exist already.
      if (tagTableExists) {
        await queryInterface.dropTable("slack");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
