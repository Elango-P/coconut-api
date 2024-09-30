module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project_ticket_type");

    if (tableDefinition && !tableDefinition["fields"]) {
      await queryInterface.addColumn("project_ticket_type", "fields", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("project_ticket_type");

    if (tableDefinition && tableDefinition["fields"]) {
      await queryInterface.removeColumn("project_ticket_type", "fields");
    }
  
  },
};
