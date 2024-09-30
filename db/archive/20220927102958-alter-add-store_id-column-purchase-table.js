'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Adding store_id column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for adding the store_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["store_id"]) {
        await queryInterface.addColumn("purchase", "store_id", {
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
      
      // Condition for removing the store_id column if it's exist in the table
      if (tableDefinition && tableDefinition["store_id"]) {
        await queryInterface.removeColumn("purchase", "store_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
