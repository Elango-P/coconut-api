'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store table - Changing the featured_media_url column type from TEXT to STRING");

      // Defining whether the store table already exist or not.
      const storeTableExists = await queryInterface.tableExists("store");

      // Condition for altering the table only if the table is exist.
      if (storeTableExists) {
        // Defining the table
        const storeTableDefinition = await queryInterface.describeTable("store");

        // Condition for changing the featured_media_url column type only if it exist in the table.
        if (storeTableDefinition && storeTableDefinition["featured_media_url"]) {
          await queryInterface.changeColumn("store", "featured_media_url", { type: Sequelize.STRING });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the store table already exist or not.
      const storeTableExists = await queryInterface.tableExists("store");

      // Condition for altering the table only if the table is exist.
      if (storeTableExists) {
        // Defining the table
        const storeTableDefinition = await queryInterface.describeTable("store");

        // Condition for changing the featured_media_url column type only if it exist in the table.
        if (storeTableDefinition && storeTableDefinition["featured_media_url"]) {
          await queryInterface.changeColumn("store", "featured_media_url", { type: Sequelize.TEXT });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
