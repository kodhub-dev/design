import type { Db } from "../client";
import { type NewWorkspace, type Workspace, workspaces } from "../schema";
import {
  count,
  create,
  type FindOptions,
  find,
  findOne,
  remove,
  update,
  type WhereOnly,
} from "./base";

export type WorkspaceModel = ReturnType<typeof createWorkspaceModel>;

export function createWorkspaceModel(db: Db) {
  return {
    find: (opts: FindOptions<Workspace> = {}) => find(db, workspaces, opts),
    findOne: (opts: WhereOnly<Workspace>) => findOne(db, workspaces, opts),
    findById: (id: string) => findOne(db, workspaces, { where: { id } }),
    create: (data: NewWorkspace) => create(db, workspaces, data),
    update: (opts: WhereOnly<Workspace>, data: Partial<NewWorkspace>) =>
      update(db, workspaces, opts, data),
    delete: (opts: WhereOnly<Workspace>) => remove(db, workspaces, opts),
    count: (opts: { where?: Partial<Workspace> } = {}) => count(db, workspaces, opts),
  };
}
