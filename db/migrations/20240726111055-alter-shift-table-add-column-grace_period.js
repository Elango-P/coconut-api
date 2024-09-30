module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("shift");

    if (tableDefinition && !tableDefinition["grace_period"]) {
      await queryInterface.addColumn("shift", "grace_period", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("shift");

    if (tableDefinition && tableDefinition["grace_period"]) {
      await queryInterface.removeColumn("shift", "grace_period");
    }
  
  },
};