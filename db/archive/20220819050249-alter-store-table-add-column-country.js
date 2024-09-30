module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["country"]) {
      await queryInterface.addColumn("store", "country", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["country"]) {
      await queryInterface.removeColumn("store", "country");
    }
  },
};
