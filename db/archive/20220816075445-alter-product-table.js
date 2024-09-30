
'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["tag_id"]) {
      await queryInterface.addColumn("product", "tag_id", {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
  },
  
  down: async (queryInterface, Sequelize) => {

    const tableDefinition = await queryInterface.describeTable("product");
    
    if (tableDefinition && tableDefinition["tag_id"]) {
      await queryInterface.removeColumn("product", "tag_id");
    }
  },
};