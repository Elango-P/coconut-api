module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && !tableDefinition["group"]) {
      await queryInterface.addColumn("order_type", "group", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && tableDefinition["group"]) {
      await queryInterface.removeColumn("order_type", "group");
    }
  
  },
};