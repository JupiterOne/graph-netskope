import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const appInstanceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://{TENANT_NAME}.goskope.com/api/v1/app_instances
     * PATTERN: Fetch Entities
     */
    id: 'fetch-app-instances',
    name: 'Fetch App Instances',
    entities: [
      {
        resourceName: 'App Instance',
        _type: 'netskope_app_instance',
        _class: ['Application'],
      },
    ],
    relationships: [
      {
        _type: 'netskope_tenant_has_app_instance',
        sourceType: 'netskope_tenant',
        _class: RelationshipClass.HAS,
        targetType: 'netskope_app_instance',
      },
    ],
    dependsOn: ['fetch-tenant'],
    implemented: true,
  },
];
