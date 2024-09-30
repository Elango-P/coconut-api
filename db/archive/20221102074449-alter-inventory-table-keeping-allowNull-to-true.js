"use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change dataType for price");
      const tableDefinition = await queryInterface.describeTable("inventory");

      if (tableDefinition && tableDefinition["deletedAt"]) {

      await queryInterface.changeColumn("inventory", "deletedAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("inventory", "deletedAt", {
      type: Sequelize.DATE,
  
    });
  },
};
