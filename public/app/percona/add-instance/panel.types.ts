import exp from "constants";
import {Databases} from "../shared/core";

export interface RemoteInstanceCredentials {
  service_name?: string;
  port?: number;
  address?: string;
  isRDS?: boolean;
  region?: string;
  aws_access_key?: string;
  aws_secret_key?: string;
  instance_id?: string;
  az?: string;
}

export enum InstanceTypes {
  rds = 'rds',
  postgresql = 'postgresql',
  mysql = 'mysql',
  proxysql = 'proxysql',
  mongodb = 'mongodb',
  external = 'external',
  haproxy = 'haproxy',
}
