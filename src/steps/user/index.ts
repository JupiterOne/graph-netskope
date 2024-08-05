import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
  getRawData,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { IntegrationSteps, Entities, Relationships } from '../constants';
import { createUserEntity } from './converter';
import { Device } from '../../types';
import toJsonSchema from 'to-json-schema';

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
        if (!user.username && !user.userkey) {
          try {
            const userSchema = toJsonSchema(user);
            logger.warn({ userSchema }, `User doesn't have a unique key`);
          } catch (err) {
            // pass
          }
          continue;
        }
        const userEntity = createUserEntity(user);
        if (!jobState.hasKey(userEntity._key)) {
          await jobState.addEntity(userEntity);
        }
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: deviceEntity,
            to: userEntity,
            properties: {
              lastEvent: user.last_event.event,
              lastEventStatus: user.last_event.status,
              lastEventNpaStatus: user.last_event.npa_status,
              lastEventActor: user.last_event.actor,
              lastEventOccurredOn: parseTimePropertyValue(
                user.last_event.timestamp,
                'ms',
              ),
            },
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
