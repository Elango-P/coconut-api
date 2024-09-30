'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Dropping the task_media table");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("task_media");

      // Condition for dropping the table only if it exists.
      if (tableDefinition) {
        await queryInterface.dropTable("task_media");
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("task_media");

      // Condition for dropping the table only if it exists.
      if (tableDefinition) {
        await queryInterface.dropTable("task_media");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
