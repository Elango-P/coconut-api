'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering recurring_task table - Adding end_date");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("recurring_task");

      // Condition for adding the end_date and end_date.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["end_date"]) {
        await queryInterface.addColumn("recurring_task", "end_date", {
          type: Sequelize.DATE,
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
      const tableDefinition = await queryInterface.describeTable("recurring_task");

      // Condition for removing the end_date and end_date column if it's exist in the table
      if (tableDefinition && tableDefinition["end_date"]) {
        await queryInterface.removeColumn("recurring_task", "end_date");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};

