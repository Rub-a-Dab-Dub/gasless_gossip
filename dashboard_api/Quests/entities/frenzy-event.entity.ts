@Entity('frenzy_events')
export class FrenzyEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  multiplier: number;

  @Column('timestamp')
  startsAt: Date;

  @Column('timestamp')
  endsAt: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('simple-array', { nullable: true })
  applicableQuestIds: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}