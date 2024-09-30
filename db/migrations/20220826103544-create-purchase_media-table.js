module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating purchase_media table");

      // Defining whether the bill_media table already exist or not.
      const purchaseMediaTableExists = await queryInterface.tableExists("purchase_media");

      // Condition for creating the bill_media table only if the table doesn't exist already.
      if (!purchaseMediaTableExists) {
        await queryInterface.createTable("purchase_media", {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          purchase_id: {
              type: Sequelize.INTEGER,
              allowNull: true,
          },
          company_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          media_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
          },
          updatedAt: {
              allowNull: true,
              type: Sequelize.DATE,
          },
          deletedAt: {
              allowNull: true,
              type: Sequelize.DATE,
          },
        });
      };
    } catch(err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the bill_media table already exist or not.
      const purchaseMediaTableExists = await queryInterface.tableExists("purchase_media");

      // Condition for dropping the bill_media table only if the table exist already.
      if (purchaseMediaTableExists) {
        await queryInterface.dropTable("purchase_media");
      };
    } catch (err) {
      console.log(err);
    };
  },
};