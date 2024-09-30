"use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change dataType for sale_price");
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && tableDefinition["sale_price"]) {

      await queryInterface.changeColumn("product", "sale_price", {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("product", "sale_price", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
