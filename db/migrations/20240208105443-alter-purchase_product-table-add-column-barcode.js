module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering purchase_product table - add column from barcode');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('purchase_product');

      if (tableDefinition && !tableDefinition['barcode']) {
        await queryInterface.addColumn('purchase_product', 'barcode', {
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
      const tableDefinition = await queryInterface.describeTable('purchase_product');

      if (tableDefinition && tableDefinition['purchase_product']) {
        await queryInterface.removeColumn('barcode', 'purchase_product');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
