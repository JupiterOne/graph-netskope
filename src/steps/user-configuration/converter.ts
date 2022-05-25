import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { UserConfig } from '../../types';

export function getUserConfigurationKey(id: string): string {
  return `netskope_user_configuration:${id}`;
}

export function createUserConfiguration(userConfig: UserConfig): Entity {
  const {
    brandingdata: { SFCheckerHost, SFCheckerIP, ...brandingdata },
  } = userConfig;

  return createIntegrationEntity({
    entityData: {
      source: userConfig,
      assign: {
        _key: getUserConfigurationKey(userConfig.email),
        _type: Entities.USER_CONFIGURATION._type,
        _class: Entities.USER_CONFIGURATION._class,
        name: userConfig.email,
        email: userConfig.email,
        addonCheckerHost: brandingdata.AddonCheckerHost,
        addonCheckerResponseCode: brandingdata.AddonCheckerResponseCode,
        addonManagerHost: brandingdata.AddonManagerHost,
        orgName: brandingdata.OrgName,
        SFCheckerHost,
        SFCheckerIP,
      },
    },
  });
}
