import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import {
  Entities,
  IntegrationSteps,
  Relationships,
  TENANT_ENTITY_KEY,
} from '../constants';
import { createDeviceEntity } from './converter';

export async function fetchDevices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const tenantEntity = (await jobState.getData(TENANT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = createDeviceEntity(device);

    if (!jobState.hasKey(deviceEntity._key)) {
      await jobState.addEntity(deviceEntity);
    } else {
      const existingDeviceEntity = await jobState.findEntity(deviceEntity._key);
      const getLoggableInfo = (device: any) => {
        return {
          _key: device?._key,
          id: device?.id,
          serial: device?.serial,
          deviceId: device?.deviceId,
        };
      };
      logger.warn(
        {
          device: getLoggableInfo(deviceEntity),
          existingDeviceEntity: getLoggableInfo(existingDeviceEntity),
        },
        'Duplicate device found.',
      );
    }

    if (tenantEntity && deviceEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: tenantEntity,
          to: deviceEntity,
        }),
      );
    }
  });
}

export const deviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.TENANT_HAS_DEVICE],
    dependsOn: [IntegrationSteps.TENANT],
    executionHandler: fetchDevices,
  },
];
