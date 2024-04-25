import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
