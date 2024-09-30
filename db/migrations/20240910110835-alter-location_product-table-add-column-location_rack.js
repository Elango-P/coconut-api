module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering store_product table - add column from location_rack');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('store_product');

      if (tableDefinition && !tableDefinition['location_rack']) {
        await queryInterface.addColumn('store_product', 'location_rack', {
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
      const tableDefinition = await queryInterface.describeTable('store_product');

      if (tableDefinition && tableDefinition['store_product']) {
        await queryInterface.removeColumn('location_rack', 'store_product');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
