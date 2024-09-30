module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");

    if (tableDefinition && !tableDefinition["allow_late_hours"]) {
      await queryInterface.addColumn("attendance", "allow_late_hours", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");

    if (tableDefinition && tableDefinition["allow_late_hours"]) {
      await queryInterface.removeColumn("attendance", "allow_late_hours");
    }
  
  },
};
