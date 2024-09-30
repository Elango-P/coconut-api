module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && !tableDefinition["reason"]) {
      await queryInterface.addColumn("order_product", "reason", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["reason"]) {
      await queryInterface.removeColumn("order_product", "reason");
    }
  
  },
};