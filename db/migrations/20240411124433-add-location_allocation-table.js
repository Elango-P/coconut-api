"use strict";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating location_allocation table");

      // Defining whether the location_allocation table already exist or not.
      const tableExists = await queryInterface.tableExists("location_allocation");

      // Condition for creating the location_allocation table only if the table doesn't exist already.
      if (!tableExists) {
        await queryInterface.createTable("location_allocation", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          date: {
            allowNull: false,
            type: Sequelize.DATEONLY,
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
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the location_allocation table already exist or not.
      const tableExists = await queryInterface.tableExists("location_allocation");

      // Condition for dropping the location_allocation table only if the table exist already.
      if (tableExists) {
        await queryInterface.dropTable("location_allocation");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
