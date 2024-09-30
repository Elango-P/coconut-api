'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account_entry table - Adding category_tag_id column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_entry");
      // Condition for adding the category_tag_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["category_tag_id"]) {
        await queryInterface.addColumn("account_entry", "category_tag_id", {
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
      if (tableDefinition && tableDefinition["category_tag_id"]) {
        await queryInterface.removeColumn("account_entry", "category_tag_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};