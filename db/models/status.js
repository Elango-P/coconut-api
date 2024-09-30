module.exports = (sequelize, DataTypes) => {
    const user = require("./User")(sequelize, DataTypes);

    const Status = sequelize.define("status", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        object_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        object_name: {
            type: DataTypes.STRING,
            allowNull: true
        },

        next_status_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        allow_edit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        allow_product_add: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        allowed_role_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        color_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        update_quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notify_to_owner: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notify_to_reviewer: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
        deletedAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
        group: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        default_owner: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        location_product_last_stock_entry_date_update: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        update_product_price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        allow_cancel: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        update_transferred_quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        default_due_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        default_reviewer: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        validate_amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        allow_to_view: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        allow_replenishment: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_active_price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        update_account_product: {
            type: DataTypes.INTEGER,
            allowNull: true 
          },
          update_quantity_in_location_product: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ticket_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        allow_refund: {
            type: DataTypes.INTEGER,
            allowNull: true 
          },
          not_received_product: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        rejected_product: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: "status",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
        paranoid: true
    });

    Status.belongsTo(user, {
        as: "userDetail",
        foreignKey: "default_owner",
    });


    return Status
}
