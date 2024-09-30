"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("activity");

        if (tableDefinition && tableDefinition["completed_at"]) {
            await queryInterface.sequelize.query(`
                ALTER TABLE "activity" 
                ALTER COLUMN "completed_at" 
                TYPE TIMESTAMP WITH TIME ZONE 
                USING CASE 
                    WHEN "completed_at" IS NULL THEN NULL 
                    ELSE TO_TIMESTAMP("completed_at"::TEXT, 'YYYY-MM-DD HH24:MI:SS') 
                END;
            `);
        }

        if (tableDefinition && tableDefinition["started_at"]) {
            await queryInterface.sequelize.query(`
                ALTER TABLE "activity" 
                ALTER COLUMN "started_at" 
                TYPE TIMESTAMP WITH TIME ZONE 
                USING CASE 
                    WHEN "started_at" IS NULL THEN NULL 
                    ELSE TO_TIMESTAMP("started_at"::TEXT, 'YYYY-MM-DD HH24:MI:SS') 
                END;
            `);
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("activity");

        if (tableDefinition && tableDefinition["completed_at"]) {
            await queryInterface.sequelize.query(`
                ALTER TABLE "activity" 
                ALTER COLUMN "completed_at" 
                TYPE TIME 
                USING CASE 
                    WHEN "completed_at" IS NULL THEN NULL 
                    ELSE "completed_at"::TIME 
                END;
            `);
        }

        if (tableDefinition && tableDefinition["started_at"]) {
            await queryInterface.sequelize.query(`
                ALTER TABLE "activity" 
                ALTER COLUMN "started_at" 
                TYPE TIME 
                USING CASE 
                    WHEN "started_at" IS NULL THEN NULL 
                    ELSE "started_at"::TIME 
                END;
            `);
        }
    },
};
