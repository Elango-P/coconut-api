module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");

    if (tableDefinition && !tableDefinition["allowed_days"]) {
      await queryInterface.addColumn("attendance_type", "allowed_days", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");

    if (tableDefinition && tableDefinition["allowed_days"]) {
      await queryInterface.removeColumn("attendance_type", "allowed_days");
    }
  
  },
};