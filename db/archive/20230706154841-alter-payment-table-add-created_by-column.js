module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('payment_account');

    if (tableDefinition && !tableDefinition['created_by']) {
      await queryInterface.addColumn('payment_account', 'created_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('payment_account');

    if (tableDefinition && tableDefinition['created_by']) {
      await queryInterface.removeColumn('payment_account', 'created_by');
    }
  
  },
};
