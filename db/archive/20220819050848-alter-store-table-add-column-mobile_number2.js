module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && !tableDefinition["mobile_number2"]) {
      await queryInterface.addColumn("store", "mobile_number2", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["mobile_number2"]) {
      await queryInterface.removeColumn("store", "mobile_number2");
    }
  },
};
