module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["allow_replenishment"]) {
      await queryInterface.addColumn("status", "allow_replenishment", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["allow_replenishment"]) {
      await queryInterface.removeColumn("status", "allow_replenishment");
    }
  },
};
