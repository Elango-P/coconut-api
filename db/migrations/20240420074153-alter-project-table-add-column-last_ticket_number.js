module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project");

    if (tableDefinition && !tableDefinition["last_ticket_number"]) {
      await queryInterface.addColumn("project", "last_ticket_number", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project");

    if (tableDefinition && tableDefinition["last_ticket_number"]) {
      await queryInterface.removeColumn("project", "last_ticket_number");
    }
  
  },
};
