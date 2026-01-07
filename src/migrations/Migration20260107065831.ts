import { Migration } from '@mikro-orm/migrations';

export class Migration20260107065831 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "calendar_event" ("id" serial primary key, "title" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "location" varchar(255) null, "notes" text null, "color" varchar(255) not null default '#AC3C00', "user_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "calendar_event" add constraint "calendar_event_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "calendar_event" cascade;`);
  }

}
