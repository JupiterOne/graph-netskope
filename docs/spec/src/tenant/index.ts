import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const tenantSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: No API Endpoint for tenant, info obtained from config
     * PATTERN: Singleton
     */
    id: 'fetch-tenant',
    name: 'Fetch Tenant Details',
    entities: [
      {
        resourceName: 'Tenant',
        _type: 'netskope_tenant',
        _class: ['Organization'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
