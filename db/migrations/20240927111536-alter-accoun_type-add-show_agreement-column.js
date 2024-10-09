module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log('Altering account_type table - add checkbox columns');

      // Defining the table
      const tableDefinition = await queryInterface.describeTable('account_type');

      let columns = ['show_addresses', 'show_agreement', 'show_contact', 'show_custom_field', 'show_settings']

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (tableDefinition && !tableDefinition[column]) {
          await queryInterface.addColumn('account_type', column, {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          });
        }
      }

    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable('account_type');

      let columns = ['show_addresses', 'show_agreement', 'show_contact', 'show_custom_field', 'show_settings']

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (tableDefinition && tableDefinition['account_type']) {
          await queryInterface.removeColumn(column, 'account_type');
        }
      }


    } catch (err) {
      console.log(err);
    }
  },
};
