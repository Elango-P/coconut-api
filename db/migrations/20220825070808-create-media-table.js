"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating media table");

      // Defining whether the media table already exist or not.
      const mediaTableExists = await queryInterface.tableExists("media");

      // Condition for creating the media table only if the table doesn't exist already.
      if (!mediaTableExists) {
        await queryInterface.createTable("media", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          file_name: {
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
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          visibility: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          object_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          object_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          feature: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
          },  
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the media table already exist or not.
      const mediaTableExists = await queryInterface.tableExists("media");

      // Condition for dropping the media table only if the table exist already.
      if (mediaTableExists) {
        await queryInterface.dropTable("media");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
