import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://{TENANT_NAME}.goskope.com/api/v1/clients
     * PATTERN: Build Child Relationships
     */
    id: 'build-device-has-user-relationships',
    name: 'Build Device Has User Relationships',
    entities: [
      {
        resourceName: 'User',
        _type: 'netskope_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'netskope_device_has_user',
        sourceType: 'netskope_device',
        _class: RelationshipClass.HAS,
        targetType: 'netskope_user',
      },
    ],
    dependsOn: ['fetch-devices'],
    implemented: true,
  },
];
