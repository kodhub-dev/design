import { and, asc, desc, eq, type SQL, sql } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import type { Db } from "../client";

export type FindOptions<TRow> = {
  where?: Partial<TRow>;
  limit?: number;
  offset?: number;
  orderBy?: { field: keyof TRow; dir?: "asc" | "desc" };
};

export type WhereOnly<TRow> = { where: Partial<TRow> };

function buildWhere<TRow>(
  table: Record<string, unknown>,
  where: Partial<TRow> | undefined,
): SQL | undefined {
  if (!where) return undefined;
  const entries = Object.entries(where).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return undefined;
  const conditions = entries.map(([k, v]) => eq(table[k] as never, v as never));
  return conditions.length === 1 ? conditions[0] : and(...conditions);
}

export async function find<T extends SQLiteTable>(
  db: Db,
  table: T,
  opts: FindOptions<T["$inferSelect"]> = {},
): Promise<T["$inferSelect"][]> {
  const cols = table as unknown as Record<string, unknown>;
  let q = db.select().from(table).$dynamic();
  const w = buildWhere(cols, opts.where);
  if (w) q = q.where(w);
  if (opts.orderBy) {
    const col = cols[opts.orderBy.field as string];
    q = q.orderBy(opts.orderBy.dir === "desc" ? desc(col as never) : asc(col as never));
  }
  if (opts.limit !== undefined) q = q.limit(opts.limit);
  if (opts.offset !== undefined) q = q.offset(opts.offset);
  return (await q) as T["$inferSelect"][];
}

export async function findOne<T extends SQLiteTable>(
  db: Db,
  table: T,
  opts: WhereOnly<T["$inferSelect"]>,
): Promise<T["$inferSelect"] | null> {
  const rows = await find(db, table, { where: opts.where, limit: 1 });
  return rows[0] ?? null;
}

export async function create<T extends SQLiteTable>(
  db: Db,
  table: T,
  data: T["$inferInsert"],
): Promise<T["$inferSelect"]> {
  const rows = (await db
    .insert(table)
    .values(data as never)
    .returning()) as T["$inferSelect"][];
  const row = rows[0];
  if (!row) throw new Error("insert returned no row");
  return row;
}

export async function update<T extends SQLiteTable>(
  db: Db,
  table: T,
  opts: WhereOnly<T["$inferSelect"]>,
  data: Partial<T["$inferInsert"]>,
): Promise<T["$inferSelect"][]> {
  const cols = table as unknown as Record<string, unknown>;
  const w = buildWhere(cols, opts.where);
  if (!w) throw new Error("update requires a non-empty where clause");
  return (await db
    .update(table)
    .set(data as never)
    .where(w)
    .returning()) as T["$inferSelect"][];
}

export async function remove<T extends SQLiteTable>(
  db: Db,
  table: T,
  opts: WhereOnly<T["$inferSelect"]>,
): Promise<number> {
  const cols = table as unknown as Record<string, unknown>;
  const w = buildWhere(cols, opts.where);
  if (!w) throw new Error("delete requires a non-empty where clause");
  const rows = await db.delete(table).where(w).returning();
  return rows.length;
}

export async function count<T extends SQLiteTable>(
  db: Db,
  table: T,
  opts: { where?: Partial<T["$inferSelect"]> } = {},
): Promise<number> {
  const cols = table as unknown as Record<string, unknown>;
  let q = db.select({ n: sql<number>`count(*)` }).from(table).$dynamic();
  const w = buildWhere(cols, opts.where);
  if (w) q = q.where(w);
  const [row] = await q;
  return Number(row?.n ?? 0);
}
