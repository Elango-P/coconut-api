'"use strict"';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename sales table to sale_settlement");
        
          const tableDefinition = await queryInterface.describeTable("sales");
        if(tableDefinition ){
          await queryInterface.renameTable("sales", "sale_settlement");
        }
    }
      catch(err){
        console.log(err);
      }
    },


  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("sale_settlement", "sales");
  }
};