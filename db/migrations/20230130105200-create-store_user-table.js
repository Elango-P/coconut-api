'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Creating store_user table");
  
      // Defining whether the store_user table already exist or not.
      const storeUserTableExists = await queryInterface.tableExists("store_user");
  
      // Condition for creating the store_user table only if the table doesn't exist already.
      if (!storeUserTableExists) {
        await queryInterface.createTable("store_user", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          shift_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the store_user table already exist or not.
      const storeUserTableExists = await queryInterface.tableExists("store_user");

      // Condition for dropping the store_user table only if the table exist already.
      if (storeUserTableExists) {
        await queryInterface.dropTable("store_user");
      };
    } catch (err) {
      console.log(err);
    };
  }
};
