module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering order table - add column from owner');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('order');

      if (tableDefinition && !tableDefinition['owner']) {
        await queryInterface.addColumn('order', 'owner', {
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
        await queryInterface.removeColumn('owner', 'order');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
