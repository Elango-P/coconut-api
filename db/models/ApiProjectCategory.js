module.exports = (sequelize, DataTypes) =>
	sequelize.define("ApiProjectCategory", {
        id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
          },
          name: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          sort: {
            allowNull: true,
            type: DataTypes.INTEGER,
          },
          status: {
            allowNull: true,
            type: DataTypes.INTEGER,
          },
          updated_by: {
            allowNull: false,
            type: DataTypes.INTEGER,
          },
          company_id : {
            type: DataTypes.INTEGER,  
            allowNull: true
          },
      
	}, {
		tableName: "api_project_category",
		timestamps: true,
		paranoid: true,
	});
