import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CRUDUsers1648672079816 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "password",
                        type: "varchar"
                    },
                    {
                        name: "isAdm",
                        type: "boolean"
                    },
                    {
                        name: "createdOn",
                        type: "date",
                        default: "now()"
                    },
                    {
                        name: "updatedOn",
                        type: "timestamp",
                        default: "now()"
                    }
                    
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
