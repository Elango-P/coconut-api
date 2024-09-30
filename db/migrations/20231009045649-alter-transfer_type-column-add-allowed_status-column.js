module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");
    if (tableDefinition && !tableDefinition["allowed_statuses"]) {
      await queryInterface.addColumn("transfer_type", "allowed_statuses", {
        type: Sequelize.STRING,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");
    if (tableDefinition && tableDefinition["allowed_statuses"]) {
      await queryInterface.removeColumn("transfer_type", "allowed_statuses");
    }
  },
};
