'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("changing allow null from true to false  for company id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("wiki_pages");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["company_id"]) {
        await queryInterface.changeColumn('wiki_pages', 'company_id',
        {
          type: Sequelize.INTEGER,
          allowNull:false
      
        }
      );
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("wishlist");
      
      // Condition for adding the portal_id column if it doesn't exist in the table
      if (tableDefinition && tableDefinition["company_id"]) {
        await queryInterface.changeColumn('wish_pages', 'company_id',
        {
          type: Sequelize.INTEGER,
          allowNull:true
      
        }
      );
      }
    } catch (err) {
      console.log(err);
    }
  }
};