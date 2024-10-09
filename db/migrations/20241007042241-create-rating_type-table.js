"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating rating_type table");

      // Defining whether the rating_type table already exist or not.
      const ratingTypeTableExists = await queryInterface.tableExists("rating_type");

      // Condition for creating the rating_type table only if the table doesn't exist already.
      if (!ratingTypeTableExists) {
        await queryInterface.createTable("rating_type", {
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
            allowNull: true,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          createdAt: {
            allowNull: true,
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
      // Defining whether the rating_type table already exist or not.
      const ratingTypeTableExists = await queryInterface.tableExists("rating_type");

      // Condition for dropping the rating_type table only if the table exist already.
      if (ratingTypeTableExists) {
        await queryInterface.dropTable("rating_type");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
