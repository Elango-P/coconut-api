module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");
    if (tableDefinition && !tableDefinition["date_of_joining"]) {
      await queryInterface.addColumn("employee", "date_of_joining", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");
    if (tableDefinition && tableDefinition["date_of_joining"]) {
      await queryInterface.removeColumn("employee", "date_of_joining");
    }
  },
};