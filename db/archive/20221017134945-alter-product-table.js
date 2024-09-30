"use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change dataType for mrp");
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && tableDefinition["mrp"]) {

      await queryInterface.changeColumn("product", "mrp", {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("product", "mrp", {
      type: Sequelize.NUMERIC,
      allowNull: true,
    });
  },
};
