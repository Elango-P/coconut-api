"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating tag table");

      // Defining whether the tag table already exist or not.
      const tagTableExists = await queryInterface.tableExists("tag");

      // Condition for creating the tag table only if the table doesn't exist already.
      if (!tagTableExists) {
        await queryInterface.createTable("tag", {
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
          type: {
            type: Sequelize.STRING,
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
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the tag table already exist or not.
      const tagTableExists = await queryInterface.tableExists("tag");

      // Condition for dropping the tag table only if the table exist already.
      if (tagTableExists) {
        await queryInterface.dropTable("tag");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
