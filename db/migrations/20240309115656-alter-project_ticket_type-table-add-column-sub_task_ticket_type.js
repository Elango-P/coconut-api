'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering project_ticket_type table - Adding sub_task_ticket_types");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("project_ticket_type");

      // Condition for adding the sub_task_ticket_types and sub_task_ticket_types.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["sub_task_ticket_types"]) {
        await queryInterface.addColumn("project_ticket_type", "sub_task_ticket_types", {
          type: Sequelize.STRING,
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

      // Condition for removing the sub_task_ticket_types and sub_task_ticket_types column if it's exist in the table
      if (tableDefinition && tableDefinition["sub_task_ticket_types"]) {
        await queryInterface.removeColumn("project_ticket_type", "sub_task_ticket_types");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};

