import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  tenantName: {
    type: 'string',
  },
  apiV1Token: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  tenantName: string;
  /**
   * Server generated API V1 Token for request authentication
   */
  apiV1Token: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.tenantName || !config.apiV1Token) {
    throw new IntegrationValidationError(
      'Config requires all of the following {tenantName, apiV1Token}. Please generate token or request access from server admin.',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
