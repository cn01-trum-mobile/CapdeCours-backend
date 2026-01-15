import { Entity, Property, PrimaryKey, ManyToOne, Opt } from '@mikro-orm/core'; // <--- Thêm Opt
import { User } from './User';
import type { Ref } from '@mikro-orm/core';

@Entity()
export class CalendarEvent {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;

  @Property({ nullable: true })
  location?: string;

  @Property({ nullable: true, type: 'text' })
  notes?: string;

  // SỬA Ở ĐÂY: Thêm & Opt và gán giá trị mặc định
  @Property({ default: '#AC3C00' })
  color!: string & Opt;

  @ManyToOne(() => User)
  user!: Ref<User>;

  // SỬA Ở ĐÂY: Thêm & Opt
  @Property()
  createdAt: Date & Opt = new Date();

  // SỬA Ở ĐÂY: Thêm & Opt
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property({ type: 'json', nullable: true })
  repeat?: RepeatRule; // Lưu trữ object { frequency, interval, until }
}

export interface RepeatRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  until?: Date; // Hoặc string ISO
}
