import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { DeviceUser } from '../../types';

export function getUserKey(id: string): string {
  return `netskope_user:${id}`;
}

export function createUserEntity(user: DeviceUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: getUserKey(user.username ?? user.userkey),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: user.userkey,
        username: user.username,
        name: user.username,
        email: user.username,
        active: true,
        userAddedTime: user.user_added_time,
        userSource: user.user_source,
      },
    },
  });
}
