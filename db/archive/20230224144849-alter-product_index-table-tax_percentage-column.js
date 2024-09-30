module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('Alter Table: Changing data type of tax_percentage as tax_percentage in product_index table');
      const tableDefinition = await queryInterface.describeTable('product_index');
      if (tableDefinition && tableDefinition['tax_percentage']) {
        await queryInterface.changeColumn('product_index', 'tax_percentage', {
          type: 'DECIMAL USING CAST("tax_percentage" as DECIMAL)',
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('product_index');
    if (tableDefinition && tableDefinition['tax_percentage']) {
      await queryInterface.changeColumn('product_index', 'tax_percentage', {
        type: 'DECIMAL USING CAST("tax_percentage" as DECIMAL)',
        allowNull: true,
      });
    }
  },
};
