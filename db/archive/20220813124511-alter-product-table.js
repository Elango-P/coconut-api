
'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["seo_title"]) {
      await queryInterface.addColumn("product", "seo_title", {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (tableDefinition && !tableDefinition["seo_keyword"]) {
      await queryInterface.addColumn("product", "seo_keyword", {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (tableDefinition && !tableDefinition["seo_description"]) {
      await queryInterface.addColumn("product", "seo_description", {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },
  
  down: async (queryInterface, Sequelize) => {

    const tableDefinition = await queryInterface.describeTable("product");
    
    if (tableDefinition && tableDefinition["seo_title"]) {
      await queryInterface.removeColumn("product", "seo_title");
    }

    if (tableDefinition && !tableDefinition["seo_keyword"]) {
      await queryInterface.removeColumn("product", "seo_keyword");
    }

    if (tableDefinition && tableDefinition["seo_description"]) {
      await queryInterface.removeColumn("product", "seo_description");
    }
  },
};