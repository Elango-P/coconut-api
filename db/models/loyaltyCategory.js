
module.exports = (sequelize, DataTypes) => {
  
  
      const loyaltyCategory = sequelize.define(
          "loyalty_category",
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true,
                  allowNull: false,
                },
                name: {
                  type: DataTypes.STRING,
                  allowNull: true,
                },
                status: {
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
              tableName: "loyalty_category",
              timestamps: true,
              paranoid: true,
              createdAt: "createdAt",
              updatedAt: "updatedAt",
              deletedAt: "deletedAt"
          }
      );
     
    
     
      return loyaltyCategory;
  };
  