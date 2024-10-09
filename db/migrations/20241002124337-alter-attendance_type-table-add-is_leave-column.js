module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");

    if (tableDefinition && !tableDefinition["is_leave"]) {
      await queryInterface.addColumn("attendance_type", "is_leave", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");

    if (tableDefinition && tableDefinition["is_leave"]) {
      await queryInterface.removeColumn("attendance_type", "is_leave");
    }
  
  },
};