import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { integrationSteps } from './steps';
import {
  validateInvocation,
  IntegrationConfig,
  instanceConfigFields,
} from './config';
import getStepStartStates from './getStepStartStates';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    getStepStartStates,
    validateInvocation,
    integrationSteps,
  };
