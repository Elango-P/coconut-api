'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {

      const tableDefinition = await queryInterface.describeTable('user');

      if (tableDefinition && tableDefinition['email']) {
        await queryInterface.changeColumn('user', 'email', {
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
      const tableDefinition = await queryInterface.describeTable('user');

      if (tableDefinition && tableDefinition['email']) {
        await queryInterface.changeColumn('user', 'email', {
          type: Sequelize.STRING,
          allowNull: false,
        });
      }
     
    } catch (err) {
      console.log(err);
    }
  },
};
