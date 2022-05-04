import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userConfigurationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://{TENANT_NAME}.goskope.com/api/v1/userconfig
     * PATTERN: Fetch Child Entities
     */
    id: 'fetch-and-build-user-has-configuration-relationships',
    name: 'Fetch and Build User Configuration',
    entities: [
      {
        resourceName: 'User Configuration',
        _type: 'netskope_user_configuration',
        _class: ['Configuration'],
      },
    ],
    relationships: [
      {
        _type: 'netskope_user_has_configuration',
        sourceType: 'netskope_user',
        _class: RelationshipClass.HAS,
        targetType: 'netskope_user_configuration',
      },
    ],
    dependsOn: ['build-device-has-user-relationships'],
    implemented: true,
  },
];
