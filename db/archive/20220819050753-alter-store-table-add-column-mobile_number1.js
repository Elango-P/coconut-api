module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && !tableDefinition["mobile_number1"]) {
      await queryInterface.addColumn("store", "mobile_number1", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["mobile_number1"]) {
      await queryInterface.removeColumn("store", "mobile_number1");
    }
  },
};
