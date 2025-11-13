import { Entity, Property, PrimaryKey, SerializedPrimaryKey, Opt } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Note {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  title!: string;

  @Property({ nullable: true })
  content?: string;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  constructor(title: string, content?: string) {
    this.title = title;
    this.content = content;
  }
}
