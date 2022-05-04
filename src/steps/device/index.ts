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
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const tenantEntity = (await jobState.getData(TENANT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = createDeviceEntity(device);
    await jobState.addEntity(deviceEntity);

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
