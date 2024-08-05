import {
  createDirectRelationship,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { IntegrationSteps, Entities, Relationships } from '../constants';
import { createUserConfiguration } from './converter';
import { DeviceUser } from '../../types';

export async function fetchUserConfiguration({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      const user = getRawData<DeviceUser>(userEntity);
      if (!user) {
        logger.warn(
          { _key: userEntity._key },
          'Could not get raw data for user entity',
        );
        return;
      }

      if (!user.username) {
        logger.warn(
          { userKey: userEntity._key },
          'Username value is missing for user entity',
        );
        return;
      }

      await apiClient.iterateUserConfigurationInUser(
        user.username,
        async (userConfig) => {
          const userConfigEntity = createUserConfiguration(userConfig);

          await jobState.addEntity(userConfigEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: userEntity,
              to: userConfigEntity,
            }),
          );
        },
      );
    },
  );
}

export const userConfigurationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.FETCH_AND_BUILD_USER_CONFIGURATION,
    name: 'Fetch and Build User Configuration',
    entities: [Entities.USER_CONFIGURATION],
    relationships: [Relationships.USER_HAS_USER_CONFIGURATION],
    dependsOn: [IntegrationSteps.BUILD_DEVICE_USER_RELATIONSHIPS],
    executionHandler: fetchUserConfiguration,
  },
];
