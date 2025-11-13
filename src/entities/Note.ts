import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Note {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ nullable: true })
  content?: string; 
}
