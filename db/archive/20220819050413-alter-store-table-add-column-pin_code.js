module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["pin_code"]) {
      await queryInterface.addColumn("store", "pin_code", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["pin_code"]) {
      await queryInterface.removeColumn("store", "pin_code");
    }
  },
};
