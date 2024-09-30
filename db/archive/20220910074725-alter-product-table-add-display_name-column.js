'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Adding display_name column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");

      // Condition for adding the display_name column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["display_name"]) {
        await queryInterface.addColumn("product", "display_name", {
          type : Sequelize.STRING,
          allowNull : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");
      
      // Condition for removing the display_name column if it's exist in the table
      if (tableDefinition && tableDefinition["display_name"]) {
        await queryInterface.removeColumn("product", "display_name");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
