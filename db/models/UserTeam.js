module.exports = (sequelize, DataTypes) => {
  const User = require('./User')(sequelize, DataTypes);

  const Schema = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    team_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
        allowNull: false,
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
  };

  const UserTeam = sequelize.define('user_team', Schema, {
    sequelize,
    tableName: 'user_team',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    paranoid: true,
  });

  // user Association
  UserTeam.belongsTo(User, {
  	as: "userDetail",
  	foreignKey: "user_id",
  	targetKey: "id",
  });

  UserTeam.belongsTo(User, {
  	as: "userTeamDetail",
  	foreignKey: "team_user_id",
  	targetKey: "id",
  });

  return UserTeam;
};
