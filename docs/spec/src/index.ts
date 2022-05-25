import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { appInstanceSpec } from './app-instance';
import { deviceSpec } from './device';
import { tenantSpec } from './tenant';
import { userSpec } from './user';
import { userConfigurationSpec } from './user-configuration';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...appInstanceSpec,
    ...deviceSpec,
    ...tenantSpec,
    ...userSpec,
    ...userConfigurationSpec,
  ],
};
