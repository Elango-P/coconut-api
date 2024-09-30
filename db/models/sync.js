module.exports = (sequelize, DataTypes) => {
    const syncSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        object_name: {
            type: DataTypes.STRING,
        },
        object_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.STRING,
        },
        result: {
            type: DataTypes.TEXT,
        },
        company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
    };

    const sync = sequelize.define("sync", syncSchema, {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
    });

    return sync;
};
