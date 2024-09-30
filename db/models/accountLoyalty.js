
module.exports = (sequelize, DataTypes) => {
  const loyaltyCategory = require("./loyaltyCategory")(sequelize, DataTypes);

  
    const accountLoyalty = sequelize.define(
        "account_loyalty",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
              },
              category_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
             account_id : {
              type: DataTypes.INTEGER,
              allowNull: true,
             },
             points : {
              type: DataTypes.INTEGER,
              allowNull: true,
             },
              company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              createdAt: {
                allowNull: true,
                type: DataTypes.DATE,
              },
              updatedAt: {
                allowNull: true,
                type: DataTypes.DATE,
              },
              deletedAt: {
                allowNull: true,
                type: DataTypes.DATE,
              },
        },
        {
            tableName: "account_loyalty",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );
    accountLoyalty.belongsTo(loyaltyCategory, {
      as: "category",
      foreignKey: "category_id",
  });
   
  
   
    return accountLoyalty;
};
