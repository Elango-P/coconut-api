'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering order_product table - Adding created_by column');
      // Defining the table
      const tableDefinition = await queryInterface.describeTable('transfer_product');
      // Condition for adding the description column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition['created_by']) {
        await queryInterface.addColumn('transfer_product', 'created_by', {
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
      const tableDefinition = await queryInterface.describeTable('transfer_product');
      // Condition for removing the description column if it's exist in the table
      if (tableDefinition && tableDefinition['created_by']) {
        await queryInterface.removeColumn('transfer_product', 'created_by');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
