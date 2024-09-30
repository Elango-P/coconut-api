module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["allow_product_add"]) {
      await queryInterface.addColumn("status", "allow_product_add", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["allow_product_add"]) {
      await queryInterface.removeColumn("status", "allow_product_add");
    }
  },
};
