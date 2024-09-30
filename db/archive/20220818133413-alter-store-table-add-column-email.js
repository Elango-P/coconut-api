module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && !tableDefinition["email"]) {
      await queryInterface.addColumn("store", "email", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["email"]) {
      await queryInterface.removeColumn("store", "email");
    }
  },
};
