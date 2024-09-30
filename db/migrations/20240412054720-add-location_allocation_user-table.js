"use strict";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating location_allocation_user table");

      // Defining whether the location_allocation_user table already exist or not.
      const tableExists = await queryInterface.tableExists("location_allocation_user");

      // Condition for creating the location_allocation_user table only if the table doesn't exist already.
      if (!tableExists) {
        await queryInterface.createTable("location_allocation_user", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          location_allocation_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          location_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          shift_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          user_id: {
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
      // Defining whether the location_allocation_user table already exist or not.
      const tableExists = await queryInterface.tableExists("location_allocation_user");

      // Condition for dropping the location_allocation_user table only if the table exist already.
      if (tableExists) {
        await queryInterface.dropTable("location_allocation_user");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
