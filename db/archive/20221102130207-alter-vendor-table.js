
 "use strict";
 module.exports = {
   async up (queryInterface, Sequelize) {
     try {
       console.log("change dataType for gst_number");
       const tableDefinition = await queryInterface.describeTable("vendor");
 
       if (tableDefinition && tableDefinition["gst_number"]) {
 
       await queryInterface.changeColumn("vendor", "gst_number", {
         type: Sequelize.STRING,
         allowNull: true,
       });
     }
     } catch (err) {
       console.log(err);
     }
   },
   down: (queryInterface, Sequelize) => {
     return queryInterface.changeColumn("vendor", "gst_number", {
       type: Sequelize.STRING,
       allowNull: true,
     });
   },
 };
 