"use strict";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating preferred_location table");

      // Defining whether the preferred_location table already exist or not.
      const tableExists = await queryInterface.tableExists("preferred_location");

      // Condition for creating the preferred_location table only if the table doesn't exist already.
      if (!tableExists) {
        await queryInterface.createTable("preferred_location", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          location_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          shift_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          preferred_order: {
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
      // Defining whether the preferred_location table already exist or not.
      const tableExists = await queryInterface.tableExists("preferred_location");

      // Condition for dropping the preferred_location table only if the table exist already.
      if (tableExists) {
        await queryInterface.dropTable("preferred_location");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
