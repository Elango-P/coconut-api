'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering replenish index table - Adding order count column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("replenish_index");

      // Condition for adding the mrp column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["order_count"]) {
        await queryInterface.addColumn("replenish_index", "order_count", {
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
      const tableDefinition = await queryInterface.describeTable("replenish_index");
      
      // Condition for removing the mrp column if it's exist in the table
      if (tableDefinition && tableDefinition["order_count"]) {
        await queryInterface.removeColumn("replenish_index", "order_count");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

