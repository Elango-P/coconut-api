module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["unit_price"]) {
      await queryInterface.addColumn("purchase_product", "unit_price", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["unit_price"]) {
      await queryInterface.removeColumn("purchase_product", "unit_price");
    }
  },
};
