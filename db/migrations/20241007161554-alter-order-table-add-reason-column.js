module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && !tableDefinition["reason"]) {
      await queryInterface.addColumn("order", "reason", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && tableDefinition["reason"]) {
      await queryInterface.removeColumn("order", "reason");
    }
  
  },
};