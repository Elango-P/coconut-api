
 "use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change dataType for unit_price");
      const tableDefinition = await queryInterface.describeTable("order_product");

      if (tableDefinition && tableDefinition["unit_price"]) {

      await queryInterface.changeColumn("order_product", "unit_price", {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
    
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("order_product", "unit_price", {
      type: Sequelize.NUMERIC,
      allowNull: true,
    });
  },
};