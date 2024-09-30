'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering ticket_index table - Changing the eta column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("ticket_index");

      // Condition for changing the eta column eta if it's exist in the table.
      if (tableDefinition && tableDefinition["eta"]) {
        await queryInterface.changeColumn("ticket_index", "eta", {
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
      const tableDefinition = await queryInterface.describeTable("ticket_index");

      //Condition for changing the eta column if it's not exist in the table.
      if (tableDefinition && tableDefinition["eta"]) {
        await queryInterface.changeColumn("ticket_index", "eta");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
