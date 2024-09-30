module.exports = (sequelize, DataTypes) =>
	sequelize.define("ApiTestResults", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          result: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          total_time: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          http_code: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          method: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          url: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          content_type: {
            allowNull: true,
            type: DataTypes.STRING,
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
          asserts_results: {
            allowNull: true,
            type: DataTypes.TEXT,
          },
          project_id: {
            allowNull: true,
            type: DataTypes.INTEGER,
          },
          api_id: {
            allowNull: true,
            type: DataTypes.INTEGER,
          },
          company_id : {
            type: DataTypes.INTEGER,  
            allowNull: true
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
          },

        tableName: "api_test_results",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
	});
