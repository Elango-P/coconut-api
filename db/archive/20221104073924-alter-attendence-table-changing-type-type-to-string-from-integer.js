"use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change interger to string for type");
      const tableDefinition = await queryInterface.describeTable("attendance");

      if (tableDefinition && tableDefinition["type"]) {

      await queryInterface.changeColumn("attendance", "type", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("attendance", "type", {
      type: Sequelize.INTEGER,
  
    });
  },
};