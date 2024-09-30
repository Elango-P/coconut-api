'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account_entry table - removing media_id column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order_product");
      // Condition for adding the category_tag_id column if it doesn't exist in the table
      if (tableDefinition && tableDefinition["media_id"]) {
        await queryInterface.removeColumn("order_product", "media_id", {
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
      const tableDefinition = await queryInterface.describeTable("account_entry");
      // Condition for removing the category_tag_id column if it's exist in the table
      if (tableDefinition && !tableDefinition["media_id"]) {
        await queryInterface.addColumn("order_product", "media_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
