'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Adding notes column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for adding the notes column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["notes"]) {
        await queryInterface.addColumn("purchase", "notes", {
          type : Sequelize.TEXT,
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
      const tableDefinition = await queryInterface.describeTable("purchase");
      
      // Condition for removing the notes column if it's exist in the table
      if (tableDefinition && tableDefinition["notes"]) {
        await queryInterface.removeColumn("purchase", "notes");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

