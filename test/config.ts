import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_API_V_1_TOKEN = 'dummy-v1-token';
const DEFAULT_TENANT_NAME = 'dummy-tenant';

export const integrationConfig: IntegrationConfig = {
  apiV1Token: process.env.API_V_1_TOKEN || DEFAULT_API_V_1_TOKEN,
  tenantName: process.env.TENANT_NAME || DEFAULT_TENANT_NAME,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
