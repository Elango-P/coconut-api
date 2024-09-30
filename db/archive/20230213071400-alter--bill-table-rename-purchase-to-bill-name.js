"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename bill table to purchase ");
        
          const tableDefinition = await queryInterface.describeTable("bill");
        if(tableDefinition ){
          await queryInterface.renameTable("bill", "purchase");
        }
    }
      catch(err){
        console.log(err);
      }
    },
  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("purchase", "bill");
  }
};
