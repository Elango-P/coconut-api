module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_test_case");

    if (tableDefinition && !tableDefinition["test_case_id"]) {
      await queryInterface.addColumn("ticket_test_case", "test_case_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_test_case");

    if (tableDefinition && tableDefinition["test_case_id"]) {
      await queryInterface.removeColumn("ticket_test_case", "test_case_id");
    }
  
  },
};
