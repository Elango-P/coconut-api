module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition && !tableDefinition["ticket_date"]) {
      await queryInterface.addColumn("ticket", "ticket_date", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition && tableDefinition["ticket_date"]) {
      await queryInterface.removeColumn("ticket", "ticket_date");
    }
  
  },
};
