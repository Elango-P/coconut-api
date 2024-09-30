
module.exports = (sequelize, DataTypes) => {  
  const location = require("./Location")(sequelize, DataTypes);
	const shift = require("./Shift")(sequelize, DataTypes);

      const locationSalesGoal = sequelize.define(
        'location_sales_goal',
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
            company_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            location_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              shift_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              amount :{
                type: DataTypes.DECIMAL,
                allowNull: true,
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
          tableName: 'location_sales_goal',
          timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
      );
      locationSalesGoal.belongsTo(location, {
        as: "locationDetails",
        foreignKey: "location_id",
      });
      locationSalesGoal.belongsTo(shift, {
        as: "shift", 
        foreignKey: "shift_id"
      })
        
  
     
      return locationSalesGoal
    };
    