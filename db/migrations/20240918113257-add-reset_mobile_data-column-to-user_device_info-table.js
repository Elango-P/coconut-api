'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");
    if (tableDefinition && !tableDefinition["reset_mobile_data"]) {
      await queryInterface.addColumn("user_device_info", "reset_mobile_data", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");
    if (tableDefinition && tableDefinition["reset_mobile_data"]) {
      await queryInterface.removeColumn("user_device_info", "reset_mobile_data");
    }
  },
};
