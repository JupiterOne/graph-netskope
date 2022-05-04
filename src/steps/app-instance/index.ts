import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import {
  IntegrationSteps,
  Entities,
  Relationships,
  TENANT_ENTITY_KEY,
} from '../constants';
import { createAppInstanceEntity } from './converter';

export async function fetchAppInstances({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const tenantEntity = (await jobState.getData(TENANT_ENTITY_KEY)) as Entity;

  await apiClient.iterateAppInstances(async (appInstance) => {
    const appInstanceEntity = createAppInstanceEntity(appInstance);

    await jobState.addEntity(appInstanceEntity);
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: tenantEntity,
        to: appInstanceEntity,
      }),
    );
  });
}

export const appInstanceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.APP_INSTANCES,
    name: 'Fetch App Instances',
    entities: [Entities.APP_INSTANCE],
    relationships: [Relationships.TENANT_HAS_APP_INSTANCE],
    dependsOn: [IntegrationSteps.TENANT],
    executionHandler: fetchAppInstances,
  },
];
