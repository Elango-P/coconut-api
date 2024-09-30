'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering ticket table - Adding parent_ticket_id");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("ticket");

      // Condition for adding the parent_ticket_id and parent_ticket_id.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["parent_ticket_id"]) {
        await queryInterface.addColumn("ticket", "parent_ticket_id", {
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
      const tableDefinition = await queryInterface.describeTable("ticket");

      // Condition for removing the parent_ticket_id and parent_ticket_id column if it's exist in the table
      if (tableDefinition && tableDefinition["parent_ticket_id"]) {
        await queryInterface.removeColumn("ticket", "parent_ticket_id");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};

