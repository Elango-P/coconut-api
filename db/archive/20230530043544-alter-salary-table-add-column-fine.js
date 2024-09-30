'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding fine column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for adding the fine column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["fine"]) {
        await queryInterface.addColumn("salary", "fine", {
          type : Sequelize.DECIMAL,
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
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for removing the fine column if it's exist in the table
      if (tableDefinition && tableDefinition["fine"]) {
        await queryInterface.removeColumn("salary", "fine");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

