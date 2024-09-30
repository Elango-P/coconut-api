'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Adding price column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");

      // Condition for adding the price column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["price"]) {
        await queryInterface.addColumn("product", "price", {
          type : Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("payment");
      
      // Condition for removing the price column if it's exist in the table
      if (tableDefinition && tableDefinition["price"]) {
        await queryInterface.removeColumn("product", "price");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
