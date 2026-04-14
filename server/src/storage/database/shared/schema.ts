import { pgTable, serial, timestamp, integer, varchar, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { index } from "drizzle-orm/pg-core"


export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const recordings = pgTable(
  "recordings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }),
    recording_date: timestamp("recording_date", { withTimezone: true }).notNull(),
    duration_seconds: integer("duration_seconds").notNull(),
    file_key: text("file_key").notNull(),
    file_size: integer("file_size").notNull(),
    snore_count: integer("snore_count").default(0).notNull(),
    avg_decibel: integer("avg_decibel").default(-50),
    max_decibel: integer("max_decibel").default(-40),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("recordings_user_id_idx").on(table.user_id),
    index("recordings_recording_date_idx").on(table.recording_date),
  ]
);

