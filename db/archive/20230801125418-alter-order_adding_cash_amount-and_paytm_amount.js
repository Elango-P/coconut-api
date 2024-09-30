'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.addColumn('order', 'cash_amount', {
      type: Sequelize.BIGINT,
      allowNull: true, // Set to false if the column should not allow NULL values
    });

    await queryInterface.addColumn('order', 'upi_amount', {
      type: Sequelize.BIGINT,
      allowNull: true, // Set to false if the column should not allow NULL values
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.removeColumn('order', 'cash_amount');
    await queryInterface.removeColumn('order', 'upi_amount');
  },
};
