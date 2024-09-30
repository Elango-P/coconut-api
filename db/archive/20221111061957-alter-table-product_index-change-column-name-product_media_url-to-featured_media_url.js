'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Renaming column from product_media_url to featured_media_url");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for renaming the column from product_media_url to featured_media_url if featured_media_url column doesn't exist in the table
      if (tableDefinition && !tableDefinition["featured_media_url"]) {
        await queryInterface.renameColumn("product_index", "product_media_url", "featured_media_url");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");
      
      // Condition for renaming the column from product_media_url to featured_media_url if featured_media_url column exist in the table
      if (tableDefinition && tableDefinition["featured_media_url"]) {
        await queryInterface.renameColumn("product_index", "featured_media_url", "product_media_url");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

