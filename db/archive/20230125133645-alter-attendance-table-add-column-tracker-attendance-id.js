'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering attendance table - Adding tracker_attendance_id column");

      // Defining whether the store table already exist or not.
      const attendanceTableExists = await queryInterface.tableExists("attendance");

      // Condition for altering the table only if the table is exist.
      if (attendanceTableExists) {
        // Defining the table
        const attendanceTableDefinition = await queryInterface.describeTable("attendance");

        // Condition for adding the tracker_attendance_id column if it doesn't exist in the table.
        if (attendanceTableDefinition && !attendanceTableDefinition["tracker_attendance_id"]) {
          await queryInterface.addColumn("attendance", "tracker_attendance_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the store table already exist or not.
      const attendanceTableExists = await queryInterface.tableExists("attendance");

      // Condition for altering the table only if the table is exist.
      if (attendanceTableExists) {
        // Defining the table
        const attendanceTableDefinition = await queryInterface.describeTable("attendance");
        
        // Condition for removing the tracker_user_id column if it's exist in the table.
        if (attendanceTableDefinition && attendanceTableDefinition["tracker_attendance_id"]) {
          await queryInterface.removeColumn("attendance", "tracker_attendance_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
