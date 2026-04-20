import type { D1Database } from "@cloudflare/workers-types";
import { createDb } from "../client";
import { createUserModel } from "./user";
import { createWorkspaceModel } from "./workspace";

export function createModels(d1: D1Database) {
  const db = createDb(d1);
  return {
    User: createUserModel(db),
    Workspace: createWorkspaceModel(db),
  };
}

export type Models = ReturnType<typeof createModels>;

export type { UserModel } from "./user";
export type { WorkspaceModel } from "./workspace";
