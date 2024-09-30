"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating user_team table");

      // Defining whether the user_team table already exist or not.
      const userTeamTableExists = await queryInterface.tableExists("user_team");

      // Condition for creating the user_team table only if the table doesn't exist already.
      if (!userTeamTableExists) {
        await queryInterface.createTable("user_team", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },

          user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },

          team_user_id: {
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
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the user_team table already exist or not.
      const userTeamTableExists = await queryInterface.tableExists("user_team");

      // Condition for dropping the user_team table only if the table exist already.
      if (userTeamTableExists) {
        await queryInterface.dropTable("user_team");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
