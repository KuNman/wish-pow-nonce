import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'computations',
})
export default class ComputationModel {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    nullable: true,
  })
    powNonce?: number;

  @Column({
    nullable: true,
  })
    hash?: string;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
