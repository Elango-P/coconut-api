module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering order table - add column from upi_payment_verified');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('order');

      if (tableDefinition && !tableDefinition['upi_payment_verified']) {
        await queryInterface.addColumn('order', 'upi_payment_verified', {
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
      const tableDefinition = await queryInterface.describeTable('order');

      if (tableDefinition && tableDefinition['order']) {
        await queryInterface.removeColumn('upi_payment_verified', 'order');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
