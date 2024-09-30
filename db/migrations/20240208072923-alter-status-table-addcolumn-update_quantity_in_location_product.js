module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering status table - add column from update_quantity_in_location_product');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('status');

      if (tableDefinition && !tableDefinition['update_quantity_in_location_product']) {
        await queryInterface.addColumn('status', 'update_quantity_in_location_product', {
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
        await queryInterface.removeColumn('update_quantity_in_location_product', 'status');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
