import { Migration } from '@mikro-orm/migrations';

export class Migration20260115074456 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "calendar_event" add column "repeat" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "calendar_event" drop column "repeat";`);
  }

}
