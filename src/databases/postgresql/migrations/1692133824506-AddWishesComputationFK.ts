import {
  MigrationInterface, QueryRunner, TableColumn, TableForeignKey,
} from 'typeorm';

export default class AddWishesComputationFK1692133824506 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('wishes', new TableColumn({
      name: 'computation_id',
      type: 'int',
      unsigned: true,
      isNullable: true,
    }));

    await queryRunner.createForeignKey('wishes', new TableForeignKey({
      columnNames: ['computation_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'computations',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('wishes');

    const DECForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('computation_id') !== -1);
    await queryRunner.dropForeignKey('wishes', DECForeignKey);

    await queryRunner.dropColumn('wishes', 'computation_id');
  }
}
