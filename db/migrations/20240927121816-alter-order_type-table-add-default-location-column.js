module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && !tableDefinition["default_location"]) {
      await queryInterface.addColumn("order_type", "default_location", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && tableDefinition["default_location"]) {
      await queryInterface.removeColumn("order_type", "default_location");
    }
  
  },
};