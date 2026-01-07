import { Entity, Property, Opt, PrimaryKey, Unique } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property({ nullable: true })
  name?: string;

  @Property()
  @Unique()
  username!: string;

  @Property({ hidden: true })
  passwordHash!: string;

  constructor(username: string, passwordHash: string, name?: string) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.name = name;
  }
}
