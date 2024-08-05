import { URL, URLSearchParams } from 'url';
import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { AppInstance, Device, NetskopeResponse, UserConfig } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

class ResponseError extends IntegrationProviderAPIError {
  response: Response;
  constructor(options) {
    super(options);
    this.response = options.response;
  }
}

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly paginateEntitiesPerPage = 500;

  private withBaseUri = (path: string, params?: Record<string, string>) => {
    const url = new URL(
      `https://${this.config.tenantName}.goskope.com/api/v1${path}`,
    );
    url.search = new URLSearchParams(params).toString();
    return url.toString();
  };

  public async request<T>(uri: string): Promise<T> {
    try {
      const result = await retry<Response>(
        async () => {
          // Only POST requests can have body, where token is placed
          const authBody = { token: this.config.apiV1Token };
          const response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify(authBody),
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) {
            throw new ResponseError({
              endpoint: uri,
              status: response.status,
              statusText: response.statusText,
              response,
            });
          }
          return response;
        },
        {
          delay: 1000,
          maxAttempts: 10,
        },
      );
      return (await result.json()) as T;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: uri.toString(),
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async getRequest<T>(uri: string): Promise<T> {
    try {
      const result = await retry<Response>(
        async () => {
          const response = await fetch(uri, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) {
            throw new ResponseError({
              endpoint: uri,
              status: response.status,
              statusText: response.statusText,
              response,
            });
          }
          return response;
        },
        {
          delay: 1000,
          maxAttempts: 10,
        },
      );
      return (await result.json()) as T;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: uri.toString(),
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const endpoint = this.withBaseUri('/clients', { limit: '1' });
    try {
      const body = await this.request<NetskopeResponse<Device[]>>(endpoint);
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
      const endpoint = this.withBaseUri('/clients', {
        limit: `${this.paginateEntitiesPerPage}`,
        skip: `${this.paginateEntitiesPerPage * page}`,
      });

      const body = await this.request<NetskopeResponse<Device[]>>(endpoint);

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
      length = body.data.length;
    } while (length > 0);
  }

  public async iterateUserConfigurationInUser(
    email: string,
    iteratee: ResourceIteratee<UserConfig>,
  ) {
    const endpoint = this.withBaseUri('/userconfig', {
      email,
      configtype: 'agent',
    });

    const body = await this.request<NetskopeResponse<UserConfig>>(endpoint);

    if (body.status === 'success') {
      await iteratee(body.data);
    }
  }

  public async iterateAppInstances(iteratee: ResourceIteratee<AppInstance>) {
    let page = 0;
    let length = 0;

    do {
      const endpoint = this.withBaseUri('/app_instances', {
        op: 'list',
        limit: `${this.paginateEntitiesPerPage}`,
        skip: `${this.paginateEntitiesPerPage * page}`,
      });

      const body =
        await this.request<NetskopeResponse<AppInstance[]>>(endpoint);

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
      length = body.data.length;
    } while (length > 0);
  }

  // A different way of listing app instances - attempt to see if this will fix the problem
  public async iterateGetAppInstances(iteratee: ResourceIteratee<AppInstance>) {
    let page = 0;
    let length = 0;

    do {
      const endpoint = this.withBaseUri('/app_instances', {
        op: 'list',
        limit: `${this.paginateEntitiesPerPage}`,
        skip: `${this.paginateEntitiesPerPage * page}`,
        token: this.config.apiV1Token,
      });

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
      length = body.data.length;
    } while (length > 0);
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
