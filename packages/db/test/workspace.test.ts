import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";
import { createModels, type Models } from "../src";

describe("Workspace", () => {
  let models: Models;

  beforeEach(async () => {
    models = createModels(env.DB);
    await models.User.create({
      id: "owner_1",
      email: "owner@example.com",
      name: "Owner",
    });
  });

  it("creates a workspace owned by an existing user", async () => {
    const w = await models.Workspace.create({
      id: "w_1",
      name: "Acme Studio",
      ownerId: "owner_1",
    });

    expect(w.id).toBe("w_1");
    expect(w.name).toBe("Acme Studio");
    expect(w.ownerId).toBe("owner_1");
    expect(w.createdAt).toBeInstanceOf(Date);
  });

  it("rejects workspace with an unknown owner (foreign key)", async () => {
    await expect(
      models.Workspace.create({ id: "w_x", name: "Orphan", ownerId: "ghost" }),
    ).rejects.toThrow();
  });

  it("cascades workspace deletion when owner is deleted", async () => {
    await models.Workspace.create({ id: "w_1", name: "A", ownerId: "owner_1" });
    await models.Workspace.create({ id: "w_2", name: "B", ownerId: "owner_1" });

    expect(await models.Workspace.count()).toBe(2);

    await models.User.delete({ where: { id: "owner_1" } });

    expect(await models.Workspace.count()).toBe(0);
  });

  it("finds workspaces by owner", async () => {
    await models.User.create({ id: "owner_2", email: "two@example.com" });
    await models.Workspace.create({ id: "w_1", name: "A", ownerId: "owner_1" });
    await models.Workspace.create({ id: "w_2", name: "B", ownerId: "owner_1" });
    await models.Workspace.create({ id: "w_3", name: "C", ownerId: "owner_2" });

    const owned = await models.Workspace.find({
      where: { ownerId: "owner_1" },
    });
    expect(owned).toHaveLength(2);
    expect(owned.map((w) => w.id).sort()).toEqual(["w_1", "w_2"]);
  });

  it("updates workspace name without touching others", async () => {
    await models.Workspace.create({
      id: "w_1",
      name: "Old",
      ownerId: "owner_1",
    });
    await models.Workspace.create({
      id: "w_2",
      name: "Other",
      ownerId: "owner_1",
    });

    const updated = await models.Workspace.update(
      { where: { id: "w_1" } },
      { name: "New" },
    );
    expect(updated).toHaveLength(1);
    expect(updated[0]?.name).toBe("New");

    const other = await models.Workspace.findById("w_2");
    expect(other?.name).toBe("Other");
  });
});
