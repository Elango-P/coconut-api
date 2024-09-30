'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store_product table - Adding transfer_quantity column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_product");
      // Condition for adding the transfer_quantity column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["transfer_quantity"]) {
        await queryInterface.addColumn("store_product", "transfer_quantity", {
          type: Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("store_product");
      // Condition for removing the transfer_quantity column if it's exist in the table
      if (tableDefinition && tableDefinition["transfer_quantity"]) {
        await queryInterface.removeColumn("store_product", "transfer_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  }
};