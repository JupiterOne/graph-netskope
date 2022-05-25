import { tenantSteps } from './tenant';
import { deviceSteps } from './device';
import { userSteps } from './user';
import { userConfigurationSteps } from './user-configuration';
import { appInstanceSteps } from './app-instance';

const integrationSteps = [
  ...tenantSteps,
  ...deviceSteps,
  ...userSteps,
  ...userConfigurationSteps,
  ...appInstanceSteps,
];

export { integrationSteps };
