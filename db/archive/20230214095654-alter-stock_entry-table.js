'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering stock_entry table - Adding owner_id column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("stock_entry");

      // Condition for adding the owner_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["owner_id"]) {
        await queryInterface.addColumn("stock_entry", "owner_id", {
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
      const tableDefinition = await queryInterface.describeTable("stock_entry");

      // Condition for removing the owner_id column if it's exist in the table
      if (tableDefinition && tableDefinition["owner_id"]) {
        await queryInterface.removeColumn("stock_entry", "owner_id");
      }

    } catch (err) {
      console.log(err);
    }
  }
};

