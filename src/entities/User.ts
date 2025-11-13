import { Entity, Property, Opt, PrimaryKey, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property()
  name: string;

  @Property({ nullable: true })
  age?: number;
  
  constructor(name: string, age?: number) {
    this.name = name;
    this.age = age;
  }
}