'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering bill table - Adding notes column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");

      // Condition for adding the notes column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["notes"]) {
        await queryInterface.addColumn("bill", "notes", {
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
      const tableDefinition = await queryInterface.describeTable("bill");
      
      // Condition for removing the notes column if it's exist in the table
      if (tableDefinition && tableDefinition["notes"]) {
        await queryInterface.removeColumn("bill", "notes");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
