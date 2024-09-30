module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");
    if (tableDefinition && !tableDefinition["createdAt"]) {
      await queryInterface.addColumn("employee", "createdAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");
    if (tableDefinition && tableDefinition["createdAt"]) {
      await queryInterface.removeColumn("employee", "createdAt");
    }
  },
};