module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");

    if (tableDefinition && !tableDefinition["allow_refund"]) {
      await queryInterface.addColumn("status", "allow_refund", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");

    if (tableDefinition && tableDefinition["allow_refund"]) {
      await queryInterface.removeColumn("status", "allow_refund");
    }
  
  },
};