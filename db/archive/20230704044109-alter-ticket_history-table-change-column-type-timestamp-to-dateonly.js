'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering ticket_history table - Changing the date column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("ticket_history");

      // Condition for changing the date column date if it's exist in the table.
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("ticket_history", "date", {
          type : Sequelize.DATEONLY,
          allowNull : true,
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("ticket_history");

      //Condition for changing the date column if it's not exist in the table.
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("ticket_history", "date");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
