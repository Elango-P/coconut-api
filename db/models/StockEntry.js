module.exports = (sequelize, DataTypes) => {
  const Location = require("./Location")(sequelize, DataTypes);
  const User = require("./User")(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);


  const StockEntrySchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_entry_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    due_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  };

  const StockEntry = sequelize.define("stock_entry", StockEntrySchema, {
    tableName: "stock_entry",
    sequelize,
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  });

  StockEntry.belongsTo(Location, {
    as: "locationDetails",
    foreignKey: "store_id",
  });
  StockEntry.belongsTo(User, {
     as: "user", 
     sourceKey: "id",
     foreignKey: "owner_id" 
    });
    StockEntry.belongsTo(status, {
      as: "statusDetail",
      foreignKey: "status"
    })
  

  return StockEntry;
};
