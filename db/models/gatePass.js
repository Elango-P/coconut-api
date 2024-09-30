
module.exports = (sequelize, DataTypes) => {
  const media = require("./Media")(sequelize, DataTypes);
  const User = require("./User")(sequelize, DataTypes);


    const gatePass = sequelize.define(
        "gate_pass",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
              },
              notes: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              owner_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              media_id: {
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
            tableName: "gate_pass",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );
    gatePass.belongsTo(media, {
      as: "media",
      foreignKey: "media_id",
  });
  gatePass.belongsTo(User, {
		as: "owner",
		foreignKey: "owner_id"
	});
  
   
    return gatePass;
};
