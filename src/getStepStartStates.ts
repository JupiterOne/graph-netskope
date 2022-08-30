import {
  DisabledStepReason,
  IntegrationExecutionContext,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { IntegrationSteps } from './steps/constants';

export default function getStepStartStates({
  instance,
  logger,
}: IntegrationExecutionContext<IntegrationConfig>): StepStartStates {
  return {
    [IntegrationSteps.TENANT]: { disabled: false },
    [IntegrationSteps.APP_INSTANCES]: {
      disabled: true,
      disabledReason: DisabledStepReason.NONE,
    }, // TODO: Upgrade route to v2 of the API
    [IntegrationSteps.DEVICES]: { disabled: false },
    [IntegrationSteps.BUILD_DEVICE_USER_RELATIONSHIPS]: { disabled: false },
    [IntegrationSteps.FETCH_AND_BUILD_USER_CONFIGURATION]: { disabled: false },
  };
}
