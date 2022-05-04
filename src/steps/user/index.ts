import {
  createDirectRelationship,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { IntegrationSteps, Entities, Relationships } from '../constants';
import { createUserEntity, getUserKey } from './converter';
import { Device } from '../../types';

export async function buildDeviceHasUserRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    {
      _type: Entities.DEVICE._type,
    },
    async (deviceEntity) => {
      const device = getRawData<Device>(deviceEntity);
      if (!device) {
        logger.warn(
          { _key: deviceEntity._key },
          'Could not get raw data for device entity',
        );
        return;
      }

      const {
        attributes: { users },
      } = device;

      for (const user of users) {
        let userEntity = await jobState.findEntity(getUserKey(user.username));
        if (!userEntity) {
          userEntity = createUserEntity(user);
          await jobState.addEntity(userEntity);
        }
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: deviceEntity,
            to: userEntity,
          }),
        );
      }
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.BUILD_DEVICE_USER_RELATIONSHIPS,
    name: 'Build Device Has User Relationships',
    entities: [Entities.USER],
    relationships: [Relationships.DEVICE_HAS_USER],
    dependsOn: [IntegrationSteps.DEVICES],
    executionHandler: buildDeviceHasUserRelationships,
  },
];
