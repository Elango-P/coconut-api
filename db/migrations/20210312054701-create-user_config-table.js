'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating user_config table");

      // Defining whether the user_config table already exist or not.
      const userConfigTableExists = await queryInterface.tableExists("user_config");

      // Condition for creating the user_config table only if the table doesn't exist already.
      if (!userConfigTableExists) {
        await queryInterface.createTable("user_config", {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          value: {
            type: Sequelize.STRING,
            allowNull: true
          },
          company_id : {
            type: Sequelize.INTEGER,
            allowNull: true
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
      // Defining whether the user_config table already exist or not.
      const userConfigTableExists = await queryInterface.tableExists("user_config");

      // Condition for dropping the user_config table only if the table exist already.
      if (userConfigTableExists) {
        await queryInterface.dropTable("user_config");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
