import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { AppInstance, Device, NetskopeResponse, UserConfig } from './types';
import { BaseAPIClient } from '@jupiterone/integration-sdk-http-client';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

const ENTITIES_PER_PAGE = 500;

export class APIClient extends BaseAPIClient {
  private readonly token: string;

  constructor(config: IntegrationConfig, logger: IntegrationLogger) {
    super({
      baseUrl: `https://${config.tenantName}.goskope.com/api/v1`,
      logger,
      logErrorBody: true,
    });
    this.token = config.apiV1Token;
  }

  protected getAuthorizationHeaders(): Record<string, string> {
    // Not fully implemented because netskope API doesn't authenticate through headers
    return {};
  }

  public async postRequest<T>(uri: string): Promise<T> {
    const response = await this.retryableRequest(uri, {
      method: 'POST',
      body: {
        token: this.token,
      },
      authorize: false, // don't set Authorization headers
    });
    return response.json();
  }

  public async getRequest<T>(uri: string): Promise<T> {
    const response = await this.retryableRequest(uri, {
      method: 'GET',
      authorize: false, // don't set Authorization headers
    });
    return response.json();
  }

  public async verifyAuthentication(): Promise<void> {
    const endpoint = '/clients?limit=1';
    try {
      const body = await this.postRequest<NetskopeResponse<Device[]>>(endpoint);
      if (body.status === 'error') {
        throw new IntegrationProviderAuthenticationError({
          endpoint,
          status: body.errorCode,
          statusText: body.errors.join('\n'),
        });
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateDevices(iteratee: ResourceIteratee<Device>) {
    let page = 0;
    let length = 0;

    do {
      const skip = ENTITIES_PER_PAGE * page;
      const endpoint = `/clients?limit=${ENTITIES_PER_PAGE}&skip=${skip}`;

      const body = await this.postRequest<NetskopeResponse<Device[]>>(endpoint);

      if (body.status === 'error') {
        throw new IntegrationProviderAPIError({
          endpoint: endpoint,
          status: body.errorCode,
          statusText: body.errors.join('\n'),
        });
      }

      for (const device of body.data ?? []) {
        await iteratee(device);
      }

      page += 1;
      length = body.data?.length;
    } while (length > 0);
  }

  public async iterateUserConfigurationInUser(
    email: string,
    iteratee: ResourceIteratee<UserConfig>,
  ) {
    const endpoint = `/userconfig?email=${email}&configtype=agent`;
    const body = await this.postRequest<NetskopeResponse<UserConfig>>(endpoint);

    if (body.status === 'success') {
      await iteratee(body.data);
    }
  }

  public async iterateAppInstances(iteratee: ResourceIteratee<AppInstance>) {
    let page = 0;
    let length = 0;

    do {
      const skip = ENTITIES_PER_PAGE * page;
      const endpoint = `/app_instances?op=list&limit=${ENTITIES_PER_PAGE}&skip=${skip}`;

      const body =
        await this.postRequest<NetskopeResponse<AppInstance[]>>(endpoint);

      if (body.status === 'error') {
        throw new IntegrationProviderAPIError({
          endpoint: endpoint,
          status: body.errorCode,
          statusText: body.errors.join('\n'),
        });
      }

      for (const appInstance of body.data ?? []) {
        await iteratee(appInstance);
      }

      page += 1;
      length = body.data?.length;
    } while (length > 0);
  }

  // A different way of listing app instances - attempt to see if this will fix the problem
  public async iterateGetAppInstances(iteratee: ResourceIteratee<AppInstance>) {
    let page = 0;
    let length = 0;

    do {
      const skip = ENTITIES_PER_PAGE * page;
      const endpoint = `/app_instances?op=list&limit=${ENTITIES_PER_PAGE}&skip=${skip}&token=${this.token}`;

      const body =
        await this.getRequest<NetskopeResponse<AppInstance[]>>(endpoint);

      if (body.status === 'error') {
        throw new IntegrationProviderAPIError({
          endpoint: endpoint,
          status: body.errorCode,
          statusText: body.errors.join('\n'),
        });
      }

      for (const appInstance of body.data ?? []) {
        await iteratee(appInstance);
      }

      page += 1;
      length = body.data?.length;
    } while (length > 0);
  }
}

let client: APIClient | undefined;
export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  if (!client) {
    client = new APIClient(config, logger);
  }
  return client;
}
