import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getTenantKey(id: string): string {
  return `netskope_tenant:${id}`;
}

export function createTenantEntity(tenantName: string): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        tenantName,
      },
      assign: {
        _key: getTenantKey(tenantName),
        _type: Entities.TENANT._type,
        _class: Entities.TENANT._class,
        name: tenantName,
      },
    },
  });
}
