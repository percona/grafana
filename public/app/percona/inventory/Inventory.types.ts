import { Databases } from '../shared/core';

export interface ServicePayload {
  service_id: string;
  service_name: string;
}

export type ServiceListPayload = { [key in Databases]?: ServicePayload[] };

export interface Service {
  id: string;
  name: string;
}

export type ServiceList = { [key in Databases]?: Service[] };
