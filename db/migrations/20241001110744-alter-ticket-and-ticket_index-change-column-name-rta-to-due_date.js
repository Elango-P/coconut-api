'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     
      const ticketTableDefinition = await queryInterface.describeTable("ticket");
      const ticketIndexTableDefinition = await queryInterface.describeTable("ticket_index");

      if (ticketTableDefinition && !ticketTableDefinition["due_date"]) {
        await queryInterface.renameColumn("ticket", "eta", "due_date");
      }

      if (ticketIndexTableDefinition && !ticketIndexTableDefinition["due_date"]) {
        await queryInterface.renameColumn("ticket_index", "eta", "due_date");
      }
   
  },

  async down (queryInterface, Sequelize) {
 
      const ticketTableDefinition = await queryInterface.describeTable("ticket");
      const ticketIndexTableDefinition = await queryInterface.describeTable("ticket");
      
      if (ticketTableDefinition && ticketTableDefinition["due_date"]) {
        await queryInterface.renameColumn("ticket", "due_date", "eta");
      }

      if (ticketIndexTableDefinition && ticketIndexTableDefinition["due_date"]) {
        await queryInterface.renameColumn("ticket_index", "due_date", "eta");
      }
  }
};
