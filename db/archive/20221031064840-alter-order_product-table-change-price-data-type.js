"use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change dataType for price");
      const tableDefinition = await queryInterface.describeTable("order_product");

      if (tableDefinition && tableDefinition["price"]) {

      await queryInterface.changeColumn("order_product", "price", {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
    
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("order_product", "price", {
      type: Sequelize.NUMERIC,
      allowNull: true,
    });
  },
};