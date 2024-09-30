'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering account_agreement table - Adding agreement_number column');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('account_agreement');

      // Condition for adding the agreement_number column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition['agreement_number']) {
        await queryInterface.addColumn('account_agreement', 'agreement_number', {
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
      const tableDefinition = await queryInterface.describeTable('account_agreement');

      // Condition for removing the agreement_number column if it's exist in the table
      if (tableDefinition && tableDefinition['agreement_number']) {
        await queryInterface.removeColumn('account_agreement', 'agreement_number');
      }

    } catch (err) {
      console.log(err);
    }
  },
};
