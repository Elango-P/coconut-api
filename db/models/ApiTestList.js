module.exports = (sequelize, DataTypes) => {
	const ApiTestList = sequelize.define("ApiTestList", {
        id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
          },
          name: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          method: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          url: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          headers: {
            allowNull: true,
            type: DataTypes.TEXT,
          },
          body: {
            allowNull: true,
            type: DataTypes.TEXT,
          },
          params: {
            allowNull: true,
            type: DataTypes.TEXT,
          },
          asserts: {
            allowNull: true,
            type: DataTypes.TEXT,
          },
          content_type: {
            allowNull: false,
            type: DataTypes.STRING,
          },
          sort: {
            allowNull: true,
            type: DataTypes.INTEGER,
          },
          company_id : {
            type: DataTypes.INTEGER,  
            allowNull: true
          },
          updated_by: {
            allowNull: true,
            type: DataTypes.INTEGER,
          },
	}, {
		tableName: "api_test_list",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false
	});
  return ApiTestList;
}