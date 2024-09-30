

module.exports = (sequelize, DataTypes) =>{
const user = require("./User")(sequelize, DataTypes);
const status = require("./status")(sequelize, DataTypes);
const Tag = require("./Tag")(sequelize, DataTypes);

	const fineBonus = sequelize.define("fine_bonus", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
          },
          type: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          status: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          user: {
            allowNull: true ,
            type: DataTypes.STRING,
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
          reviewer: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          amount: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          notes: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          due_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
          },
          object_name: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          object_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },

	}, {
		tableName: "fine_bonus",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

  fineBonus.belongsTo(user, {
    as: "userDetails",
    foreignKey: "user",
});


fineBonus.belongsTo(user, {
    as: "userData",
    foreignKey: "reviewer",
});

fineBonus.belongsTo(status, {
  as: "statusData",
  foreignKey: "status",
});
fineBonus.belongsTo(Tag,{
  as:"typeData",
  foreignKey:"type"
})

return fineBonus;
}