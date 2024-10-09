module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");

    let fields = ["allow_late_checkin", "is_additional_day", "is_additional_shift", "is_additional_leave", "is_working_day","is_absent"];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (tableDefinition && !tableDefinition[field]) {
        await queryInterface.addColumn("attendance_type", field, {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        });
      }
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");
    let fields = ["allow_late_checkin", "is_additional_day", "is_additional_shift", "is_additional_leave", "is_working_day","is_absent"];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (tableDefinition && tableDefinition[field]) {
        await queryInterface.removeColumn("attendance_type", field);
      }
    }

  
  },
};