'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering recurring_task table - Changing the start_date column from integer to string');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('recurring_task');

      // Condition for changing the start_date column start_date if it's exist in the table.
      if (tableDefinition && tableDefinition['start_date']) {
        await queryInterface.changeColumn('recurring_task', 'start_date', {
          type: Sequelize.DATEONLY,
          allowNull: true,
        });
      }
      if (tableDefinition && tableDefinition['end_date']) {
        await queryInterface.changeColumn('recurring_task', 'end_date', {
          type: Sequelize.DATEONLY,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable('recurring_task');

      //Condition for changing the start_date column if it's not exist in the table.
      if (tableDefinition && tableDefinition['start_date']) {
        await queryInterface.changeColumn('recurring_task', 'start_date');
      }
      if (tableDefinition && tableDefinition['end_date']) {
        await queryInterface.changeColumn('recurring_task', 'end_date');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
