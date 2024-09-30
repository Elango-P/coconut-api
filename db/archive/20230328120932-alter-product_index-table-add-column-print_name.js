'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Adding print_name column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");
      // Condition for adding the print_name column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["print_name"]) {
        await queryInterface.addColumn("product_index", "print_name", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");
      // Condition for removing the print_name column if it's exist in the table
      if (tableDefinition && tableDefinition["print_name"]) {
        await queryInterface.removeColumn("product_index", "print_name");
      }
    } catch (err) {
      console.log(err);
    }
  }
};