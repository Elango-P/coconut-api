module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["cost_price"]) {
      await queryInterface.addColumn("purchase_product", "cost_price", {
        type: Sequelize.DECIMAL,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["cost_price"]) {
      await queryInterface.removeColumn("purchase_product", "cost_price");
    }
  },
};
