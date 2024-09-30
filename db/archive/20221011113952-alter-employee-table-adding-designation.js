module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");
    if (tableDefinition && !tableDefinition["designation"]) {
      await queryInterface.addColumn("employee", "designation", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");
    if (tableDefinition && tableDefinition["designation"]) {
      await queryInterface.removeColumn("employee", "designation");
    }
  },
};