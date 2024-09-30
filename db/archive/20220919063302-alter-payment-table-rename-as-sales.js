'"use strict"';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try{
        console.log("Rename payment table to sales");
        
          const tableDefinition = await queryInterface.describeTable("payment");
        if(tableDefinition ){
          await queryInterface.renameTable("payment", "sales");
        }
    }
      catch(err){
        console.log(err);
      }
    },


  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("sales", "payment");
  }
};