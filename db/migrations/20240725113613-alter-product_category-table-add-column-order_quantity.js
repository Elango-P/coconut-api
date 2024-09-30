module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_category");

    if (tableDefinition && !tableDefinition["order_quantity"]) {
      await queryInterface.addColumn("product_category", "order_quantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_category");

    if (tableDefinition && tableDefinition["order_quantity"]) {
      await queryInterface.removeColumn("product_category", "order_quantity");
    }
  },
};