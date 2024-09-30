'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering status table - Adding ticket_type_id");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("status");

      // Condition for adding the ticket_type_id and ticket_type_id.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["ticket_type_id"]) {
        await queryInterface.addColumn("status", "ticket_type_id", {
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
      const tableDefinition = await queryInterface.describeTable("status");

      // Condition for removing the ticket_type_id and ticket_type_id column if it's exist in the table
      if (tableDefinition && tableDefinition["ticket_type_id"]) {
        await queryInterface.removeColumn("status", "ticket_type_id");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};

