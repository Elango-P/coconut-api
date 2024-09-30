"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename bill media table to purchase media");
        
          const tableDefinition = await queryInterface.describeTable("bill_product");
        if(tableDefinition ){
          await queryInterface.renameTable("bill_product", "purchase_product");
        }
    }
      catch(err){
        console.log(err);
      }
    },
  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("purchase_product", "bill_product");
  }
};