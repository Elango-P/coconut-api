module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");
    if (tableDefinition && !tableDefinition["taxable_amount"]) {
      await queryInterface.addColumn("order_product", "taxable_amount", {
        type: Sequelize.DECIMAL,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");
    if (tableDefinition && tableDefinition["taxable_amount"]) {
      await queryInterface.removeColumn("order_product", "taxable_amount");
    }
  },
};
