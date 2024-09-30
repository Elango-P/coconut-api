"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("product_index");

      if (tableDefinition && !tableDefinition["allow_online_sale"]) {
        await queryInterface.addColumn("product_index", "allow_online_sale", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }

    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    
    const tableDefinition = await queryInterface.describeTable("product_index");


    if (tableDefinition && tableDefinition["allow_online_sale"]) {
      await queryInterface.removeColumn("product_index", "allow_online_sale");
    }
  },
};
