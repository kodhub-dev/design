import type { Db } from "../client";
import { type NewUser, type User, users } from "../schema";
import {
  count,
  create,
  find,
  findOne,
  type FindOptions,
  remove,
  update,
  type WhereOnly,
} from "./base";

export type UserModel = ReturnType<typeof createUserModel>;

export function createUserModel(db: Db) {
  return {
    find: (opts: FindOptions<User> = {}) => find(db, users, opts),
    findOne: (opts: WhereOnly<User>) => findOne(db, users, opts),
    findById: (id: string) => findOne(db, users, { where: { id } }),
    create: (data: NewUser) => create(db, users, data),
    update: (opts: WhereOnly<User>, data: Partial<NewUser>) =>
      update(db, users, opts, data),
    delete: (opts: WhereOnly<User>) => remove(db, users, opts),
    count: (opts: { where?: Partial<User> } = {}) => count(db, users, opts),
  };
}
