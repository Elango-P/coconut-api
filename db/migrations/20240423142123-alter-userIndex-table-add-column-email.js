'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering user_index table - Changing the email column from integer to string');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('user_index');

      // Condition for changing the email column email if it's exist in the table.
      if (tableDefinition && tableDefinition['email']) {
        await queryInterface.changeColumn('user_index', 'email', {
          type: Sequelize.STRING,
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
      const tableDefinition = await queryInterface.describeTable('user_index');

      //Condition for changing the email column if it's not exist in the table.
      if (tableDefinition && tableDefinition['email']) {
        await queryInterface.changeColumn('user_index', 'email');
      }
     
    } catch (err) {
      console.log(err);
    }
  },
};
