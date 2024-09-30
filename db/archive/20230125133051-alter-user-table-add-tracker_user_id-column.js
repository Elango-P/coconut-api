'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user table - Adding tracker_user_id column");

      // Defining whether the store table already exist or not.
      const userTableExists = await queryInterface.tableExists("user");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("user");

        // Condition for adding the tracker_user_id column if it doesn't exist in the table.
        if (userTableDefinition && !userTableDefinition["tracker_user_id"]) {
          await queryInterface.addColumn("user", "tracker_user_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the store table already exist or not.
      const userTableExists = await queryInterface.tableExists("user");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("user");
        
        // Condition for removing the tracker_user_id column if it's exist in the table.
        if (userTableDefinition && userTableDefinition["tracker_user_id"]) {
          await queryInterface.removeColumn("user", "tracker_user_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
