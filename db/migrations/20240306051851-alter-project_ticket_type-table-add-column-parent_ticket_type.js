'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering project_ticket_type table - Adding parent_ticket_type");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("project_ticket_type");

      // Condition for adding the parent_ticket_type and parent_ticket_type.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["parent_ticket_type"]) {
        await queryInterface.addColumn("project_ticket_type", "parent_ticket_type", {
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
      const tableDefinition = await queryInterface.describeTable("project_ticket_type");

      // Condition for removing the parent_ticket_type and parent_ticket_type column if it's exist in the table
      if (tableDefinition && tableDefinition["parent_ticket_type"]) {
        await queryInterface.removeColumn("project_ticket_type", "parent_ticket_type");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};

