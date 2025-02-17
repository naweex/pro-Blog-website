import { EntitiName } from "src/common/enums/entity.enum";
import { Roles } from "src/common/enums/role.enum";
import { UserStatus } from "src/modules/user/enums/status.enum";
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class Migrations1715197381817 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntitiName.User,
                columns: [
                    { name: "id", isPrimary: true, type: "serial", isNullable: false },
                    { name: "username", type: "character varying(50)", isNullable: true, isUnique: true },
                    { name: "phone", type: "character varying(12)", isNullable: true, isUnique: true },
                    { name: "email", type: "character varying(100)", isNullable: true, isUnique: true },
                    { name: "role", type: "enum", enum: [Roles.Admin, Roles.User] },
                    { name: "status", type: "enum", enum: [UserStatus.Block, UserStatus.Report], isNullable: true },
                    { name: "profileId", type: "int", isUnique: true, isNullable: true },
                    { name: "new_email", type: "varchar", isNullable: true },
                    { name: "new_phone", type: "varchar", isNullable: true },
                    { name: "verify_phone", type: "boolean", isNullable: true, default: false },
                    { name: "verify_email", type: "boolean", isNullable: true, default: false },
                    { name: "password", type: "varchar(20)", isNullable: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                ]
            }),
            true
        );
        // const balance = await queryRunner.hasColumn(EntitiName.User, "balance")
        // //@ts-ignore
        // if (!balance) await queryRunner.addColumn(EntitiName.User, { name: "balance", type: "numeric", default: 0, isNullable: true })
        // const username = await queryRunner.hasColumn(EntitiName.User, "username");
        // if (username) {
        //     //@ts-ignore
        //     await queryRunner.changeColumn(EntitiName.User, "username", new TableColumn({
        //         type: "varchar(50)",
        //         name: "username",
        //         isNullable: false,
        //         isUnique: true,
        //     }))
        // }
        // await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "mobile" TO "phone"`);
        await queryRunner.createTable(new Table({
            name: EntitiName.Profile,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nick_name", type: "varchar(50)", isNullable: true },
                { name: "bio", type: "varchar", isNullable: true },
                { name: "image_profile", type: "varchar", isNullable: true },
                { name: "userId", type: "int", isNullable: false, isUnique: true },
            ]
        }), true);
        await queryRunner.createForeignKey(EntitiName.Profile, new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntitiName.User,
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey(EntitiName.User, new TableForeignKey({
            columnNames: ['profileId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntitiName.Profile,
        }))

        await queryRunner.createTable(new Table({
            name: EntitiName.Blog,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "title", type: "varchar(150)", isNullable: false },
                { name: "content", type: "text", isNullable: false },
                { name: "userId", isNullable: false, type: "int" }
            ],
        }), true);

        await queryRunner.createForeignKey(EntitiName.Blog, new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ['id'],
            referencedTableName: EntitiName.User,
            onDelete: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.dropColumn(EntitiName.User, "balance")
        const profile = await queryRunner.getTable(EntitiName.Profile);
        if(profile) {
            const userFk = profile.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
            if (userFk) await queryRunner.dropForeignKey(EntitiName.Profile, userFk);
        }

        const user = await queryRunner.getTable(EntitiName.User)
        if(user) {
            const profileFk = user.foreignKeys.find(fk => fk.columnNames.indexOf("profileId") !== -1);
            if (profileFk) await queryRunner.dropForeignKey(EntitiName.User, profileFk)
        }

        const blog = await queryRunner.getTable(EntitiName.Blog);
        if(blog) {
            const userBlogFk = blog.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
            if (userBlogFk) await queryRunner.dropForeignKey(EntitiName.Blog, userBlogFk)
        }

        await queryRunner.dropTable(EntitiName.Blog, true);
        await queryRunner.dropTable(EntitiName.Profile, true);
        await queryRunner.dropTable(EntitiName.User, true);
    }

} 
