import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { createModels } from "../src";

describe("User", () => {
  it("creates a user and returns the persisted row with defaulted createdAt", async () => {
    const { User } = createModels(env.DB);
    const created = await User.create({
      id: "u_1",
      email: "a@example.com",
      name: "Alice",
    });

    expect(created.id).toBe("u_1");
    expect(created.email).toBe("a@example.com");
    expect(created.name).toBe("Alice");
    expect(created.createdAt).toBeInstanceOf(Date);
    expect(created.createdAt.getTime()).toBeGreaterThan(0);
  });

  it("finds users by exact field match", async () => {
    const { User } = createModels(env.DB);
    await User.create({ id: "u_1", email: "a@example.com", name: "Alice" });
    await User.create({ id: "u_2", email: "b@example.com", name: "Bob" });
    await User.create({ id: "u_3", email: "c@example.com", name: "Alice" });

    const alices = await User.find({ where: { name: "Alice" } });
    expect(alices).toHaveLength(2);
    expect(alices.map((u) => u.id).sort()).toEqual(["u_1", "u_3"]);
  });

  it("returns empty array when find matches nothing", async () => {
    const { User } = createModels(env.DB);
    const rows = await User.find({ where: { name: "Nobody" } });
    expect(rows).toEqual([]);
  });

  it("findById returns the row or null", async () => {
    const { User } = createModels(env.DB);
    await User.create({ id: "u_1", email: "a@example.com" });

    const found = await User.findById("u_1");
    expect(found?.email).toBe("a@example.com");

    const missing = await User.findById("nope");
    expect(missing).toBeNull();
  });

  it("findOne returns first match or null", async () => {
    const { User } = createModels(env.DB);
    await User.create({ id: "u_1", email: "a@example.com", name: "Alice" });
    await User.create({ id: "u_2", email: "b@example.com", name: "Alice" });

    const one = await User.findOne({ where: { name: "Alice" } });
    expect(one).not.toBeNull();
    expect(["u_1", "u_2"]).toContain(one?.id);

    const none = await User.findOne({ where: { name: "Ghost" } });
    expect(none).toBeNull();
  });

  it("respects limit and orderBy", async () => {
    const { User } = createModels(env.DB);
    await User.create({ id: "u_a", email: "a@x.com", name: "A" });
    await User.create({ id: "u_b", email: "b@x.com", name: "B" });
    await User.create({ id: "u_c", email: "c@x.com", name: "C" });

    const asc = await User.find({
      orderBy: { field: "id", dir: "asc" },
      limit: 2,
    });
    expect(asc.map((u) => u.id)).toEqual(["u_a", "u_b"]);

    const desc = await User.find({
      orderBy: { field: "id", dir: "desc" },
      limit: 2,
    });
    expect(desc.map((u) => u.id)).toEqual(["u_c", "u_b"]);
  });

  it("updates only matching rows and returns them", async () => {
    const { User } = createModels(env.DB);
    await User.create({ id: "u_1", email: "a@example.com", name: "Alice" });
    await User.create({ id: "u_2", email: "b@example.com", name: "Bob" });

    const updated = await User.update(
      { where: { id: "u_1" } },
      { name: "Alicia" },
    );
    expect(updated).toHaveLength(1);
    expect(updated[0]?.name).toBe("Alicia");

    const bob = await User.findById("u_2");
    expect(bob?.name).toBe("Bob");
  });

  it("deletes only matching rows and returns the count", async () => {
    const { User } = createModels(env.DB);
    await User.create({ id: "u_1", email: "a@example.com", name: "Alice" });
    await User.create({ id: "u_2", email: "b@example.com", name: "Alice" });
    await User.create({ id: "u_3", email: "c@example.com", name: "Bob" });

    const deleted = await User.delete({ where: { name: "Alice" } });
    expect(deleted).toBe(2);

    const remaining = await User.find({});
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.id).toBe("u_3");
  });

  it("refuses to delete with an empty where clause", async () => {
    const { User } = createModels(env.DB);
    await expect(User.delete({ where: {} })).rejects.toThrow(/where/i);
  });

  it("refuses to update with an empty where clause", async () => {
    const { User } = createModels(env.DB);
    await expect(User.update({ where: {} }, { name: "x" })).rejects.toThrow(
      /where/i,
    );
  });

  it("count returns total or filtered total", async () => {
    const { User } = createModels(env.DB);
    expect(await User.count()).toBe(0);

    await User.create({ id: "u_1", email: "a@example.com", name: "Alice" });
    await User.create({ id: "u_2", email: "b@example.com", name: "Bob" });
    await User.create({ id: "u_3", email: "c@example.com", name: "Alice" });

    expect(await User.count()).toBe(3);
    expect(await User.count({ where: { name: "Alice" } })).toBe(2);
  });

  it("rejects duplicate email (unique constraint)", async () => {
    const { User } = createModels(env.DB);
    await User.create({ id: "u_1", email: "dup@example.com" });
    await expect(
      User.create({ id: "u_2", email: "dup@example.com" }),
    ).rejects.toThrow();
  });
});
