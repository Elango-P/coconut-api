module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_index");

    if (tableDefinition && !tableDefinition["ticket_date"]) {
      await queryInterface.addColumn("ticket_index", "ticket_date", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_index");

    if (tableDefinition && tableDefinition["ticket_date"]) {
      await queryInterface.removeColumn("ticket_index", "ticket_date");
    }
  
  },
};
