import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { TENANT_ENTITY_KEY, IntegrationSteps, Entities } from '../constants';
import { createTenantEntity } from './converter';

export async function fetchTenantDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { tenantName } = instance.config;
  const accountEntity = createTenantEntity(tenantName);

  await jobState.addEntity(accountEntity);
  await jobState.setData(TENANT_ENTITY_KEY, accountEntity);
}

export const tenantSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.TENANT,
    name: 'Fetch Tenant Details',
    entities: [Entities.TENANT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchTenantDetails,
  },
];
