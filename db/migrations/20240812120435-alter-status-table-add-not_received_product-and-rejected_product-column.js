module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering status table - add column from not_received_product');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('status');

      if (tableDefinition && !tableDefinition['not_received_product']) {
        await queryInterface.addColumn('status', 'not_received_product', {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition['rejected_product']) {
        await queryInterface.addColumn('status', 'rejected_product', {
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
      const tableDefinition = await queryInterface.describeTable('status');

      if (tableDefinition && tableDefinition['status']) {
        await queryInterface.removeColumn('not_received_product', 'status');
      }
      if (tableDefinition && tableDefinition['status']) {
        await queryInterface.removeColumn('rejected_product', 'status');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
