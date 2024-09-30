module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && !tableDefinition["delivery_executive"]) {
      await queryInterface.addColumn("order", "delivery_executive", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && tableDefinition["order"]) {
      await queryInterface.removeColumn("order", "delivery_executive");
    }
  },
};
