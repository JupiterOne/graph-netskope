import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const TENANT_ENTITY_KEY = 'entity:tenant';

export const IntegrationSteps = {
  TENANT: 'fetch-tenant',
  APP_INSTANCES: 'fetch-app-instances',
  DEVICES: 'fetch-devices',
  BUILD_DEVICE_USER_RELATIONSHIPS: 'build-device-has-user-relationships',
  FETCH_AND_BUILD_USER_CONFIGURATION:
    'fetch-and-build-user-has-configuration-relationships',
};

export const Entities: Record<
  'TENANT' | 'DEVICE' | 'USER' | 'USER_CONFIGURATION' | 'APP_INSTANCE',
  StepEntityMetadata
> = {
  TENANT: {
    resourceName: 'Tenant',
    _type: 'netskope_tenant',
    _class: ['Organization'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id'],
    },
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'netskope_device',
    _class: ['Device'],
    schema: {
      properties: {
        category: { type: 'string' },
        make: { type: 'string' },
        model: { type: 'string' },
        serial: { type: 'string' },
        deviceId: { type: 'string' },
        name: { type: 'string' },
        id: { type: 'string' },
        clientInstallTime: { type: 'number' },
        clientVersion: { type: 'string' },
        os: { type: 'string' },
        osVersion: { type: 'string' },
      },
      required: ['id'],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'netskope_user',
    _class: ['User'],
    schema: {
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        active: { type: 'boolean' },
        userAddedTime: { type: 'number' },
        userSource: { type: 'string' },
      },
      required: ['username', 'active', 'id', 'email'],
    },
  },
  USER_CONFIGURATION: {
    resourceName: 'User Configuration',
    _type: 'netskope_user_configuration',
    _class: ['Configuration'],
    schema: {
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        addonCheckerHost: { type: 'string' },
        addonCheckerResponseCode: { type: 'string' },
        addonManagerHost: { type: 'string' },
        orgName: { type: 'string' },
        SFCheckerHost: { type: 'string' },
        SFCheckerIP: { type: 'string' },
      },
      required: ['email'],
    },
  },
  APP_INSTANCE: {
    resourceName: 'App Instance',
    _type: 'netskope_app_instance',
    _class: ['Application'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        app: { type: 'string' },
        type: { type: 'string' },
        lastModified: { type: 'string' },
      },
      required: ['id'],
    },
  },
};

export const Relationships: Record<
  | 'TENANT_HAS_DEVICE'
  | 'DEVICE_HAS_USER'
  | 'USER_HAS_USER_CONFIGURATION'
  | 'TENANT_HAS_APP_INSTANCE',
  StepRelationshipMetadata
> = {
  TENANT_HAS_DEVICE: {
    _type: 'netskope_tenant_has_device',
    sourceType: Entities.TENANT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
  DEVICE_HAS_USER: {
    _type: 'netskope_device_has_user',
    sourceType: Entities.DEVICE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  USER_HAS_USER_CONFIGURATION: {
    _type: 'netskope_user_has_configuration',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER_CONFIGURATION._type,
  },
  TENANT_HAS_APP_INSTANCE: {
    _type: 'netskope_tenant_has_app_instance',
    sourceType: Entities.TENANT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.APP_INSTANCE._type,
  },
};
