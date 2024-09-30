'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store table - Adding featured_media_url column");

      // Defining whether the store table already exist or not.
      const storeTableExists = await queryInterface.tableExists("store");

      // Condition for altering the table only if the table is exist.
      if (storeTableExists) {
        // Defining the table
        const storeTableDefinition = await queryInterface.describeTable("store");

        // Condition for adding the featured_media_url column if it doesn't exist in the table.
        if (storeTableDefinition && !storeTableDefinition["featured_media_url"]) {
          await queryInterface.addColumn("store", "featured_media_url", {
            type: Sequelize.TEXT,
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
      const storeTableExists = await queryInterface.tableExists("store");

      // Condition for altering the table only if the table is exist.
      if (storeTableExists) {
        // Defining the table
        const storeTableDefinition = await queryInterface.describeTable("store");
        
        // Condition for removing the featured_media_url column if it's exist in the table.
        if (storeTableDefinition && storeTableDefinition["featured_media_url"]) {
          await queryInterface.removeColumn("store", "featured_media_url");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
