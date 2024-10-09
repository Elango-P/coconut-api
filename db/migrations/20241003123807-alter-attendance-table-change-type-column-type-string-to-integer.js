'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering attendance table - Changing the type column type STRING to INTEGER");
      // Defining whether the attendance table already exist or not.
      const attendanceTableExists = await queryInterface.tableExists("attendance");
      // Condition for altering the table only if the table is exist.
      if (attendanceTableExists) {
        // Defining the table
        const TableDefinition = await queryInterface.describeTable("attendance");
        // Condition for changing the type column only if it exist in the table.
        if (TableDefinition && TableDefinition["type"]) {
          await queryInterface.changeColumn("attendance", "type", { type: 'INTEGER USING CAST("type" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the attendance table already exist or not.
      const attendanceTableExists = await queryInterface.tableExists("attendance");
      // Condition for altering the table only if the table is exist.
      if (attendanceTableExists) {
        // Defining the table
        const TableDefinition = await queryInterface.describeTable("attendance");
        // Condition for changing the type column type only if it exist in the table.
        if (TableDefinition && TableDefinition["type"]) {
          await queryInterface.changeColumn("attendance", "type", { type: 'STRING USING CAST("type" as STRING)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
