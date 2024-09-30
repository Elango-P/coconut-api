"use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change dataType for mrp");
      const tableDefinition = await queryInterface.describeTable("product_index");

      if (tableDefinition && tableDefinition["mrp"]) {

      await queryInterface.changeColumn("product_index", "mrp", {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("product_index", "mrp", {
      type: Sequelize.NUMERIC,
      allowNull: true,
    });
  },
};
