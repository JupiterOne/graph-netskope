import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const deviceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://{TENANT_NAME}.goskope.com/api/v1/clients
     * PATTERN: Fetch Entities
     */
    id: 'fetch-devices',
    name: 'Fetch Devices',
    entities: [
      {
        resourceName: 'Device',
        _type: 'netskope_device',
        _class: ['Device'],
      },
    ],
    relationships: [
      {
        _type: 'netskope_tenant_has_device',
        sourceType: 'netskope_tenant',
        _class: RelationshipClass.HAS,
        targetType: 'netskope_device',
      },
    ],
    dependsOn: ['fetch-tenant'],
    implemented: true,
  },
];
