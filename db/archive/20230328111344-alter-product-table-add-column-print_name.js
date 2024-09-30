'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Adding print_name column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");
      // Condition for adding the print_name column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["print_name"]) {
        await queryInterface.addColumn("product", "print_name", {
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
      const tableDefinition = await queryInterface.describeTable("product");
      // Condition for removing the print_name column if it's exist in the table
      if (tableDefinition && tableDefinition["print_name"]) {
        await queryInterface.removeColumn("product", "print_name");
      }
    } catch (err) {
      console.log(err);
    }
  }
};