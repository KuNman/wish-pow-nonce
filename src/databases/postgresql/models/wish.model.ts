import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import ComputationModel from './computation.model';

@Entity({
  name: 'wishes',
})
export default class WishModel {
  @PrimaryGeneratedColumn('uuid')
    uuid: string;

  @Column()
    body: string;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

  @OneToOne(() => ComputationModel)
  @JoinColumn({
    name: 'computation_id',
  })
    computation: ComputationModel;
}
