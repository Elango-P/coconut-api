module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && !tableDefinition["margin_percentage"]) {
      await queryInterface.addColumn("product", "margin_percentage", {
        type: Sequelize.DECIMAL,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["margin_percentage"]) {
      await queryInterface.removeColumn("product", "margin_percentage");
    }
  },
};
