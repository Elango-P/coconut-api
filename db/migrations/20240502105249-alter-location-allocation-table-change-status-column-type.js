'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering location_allocation table - Changing the status column from integer to string');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('location_allocation');

      // Condition for changing the status column status if it's exist in the table.
      if (tableDefinition && tableDefinition['status']) {
        await queryInterface.changeColumn('location_allocation', 'status', {
          type: Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable('location_allocation');

      //Condition for changing the status column if it's not exist in the table.
      if (tableDefinition && tableDefinition['status']) {
        await queryInterface.changeColumn('location_allocation', 'status');
      }
     
    } catch (err) {
      console.log(err);
    }
  },
};
