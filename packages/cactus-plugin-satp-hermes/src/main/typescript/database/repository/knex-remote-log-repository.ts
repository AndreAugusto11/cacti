import type { IRemoteLogRepository } from "./interfaces/repository";
import type { RemoteLog } from "../../core/types";
import knex, { type Knex } from "knex";
import fs from "fs-extra";
import { knexRemoteInstance } from "../../database/knexfile-remote";
import path from "node:path";

export class KnexRemoteLogRepository implements IRemoteLogRepository {
  readonly database: Knex;

  // for now we will ignore the config because it needs to be static
  // so that both gateways can have access to the same database
  // simulating a remote log storage
  public constructor(config: Knex.Config | undefined) {
    const envName = process.env.ENVIRONMENT || "development";
    const configFile = knexRemoteInstance[envName];

    config = config || configFile;

    if (!fs.existsSync(path.join(__dirname, "../migrations"))) {
      config = {
        ...config,
        migrations: {
          directory: path.join(__dirname, "../migrations"),
        },
      } as Knex.Config;
    } else {
      config = {
        ...config,
        migrations: {
          directory: path.join(__dirname, "database/migrations"),
        },
      } as Knex.Config;
    }
    this.database = knex(config);
  }

  getLogsTable(): Knex.QueryBuilder {
    return this.database("remote-logs");
  }

  readById(logKey: string): Promise<RemoteLog> {
    return this.getLogsTable().where({ key: logKey }).first();
  }

  // TODO fix any type
  create(log: RemoteLog): any {
    return this.getLogsTable().insert(log);
  }

  async reset() {
    await this.database.migrate.rollback();
    await this.database.migrate.latest();
  }

  async destroy() {
    await this.database.destroy();
  }
}
