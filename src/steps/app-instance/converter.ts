import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { AppInstance } from '../../types';

export function getAppInstanceKey(id: string): string {
  return `netskope_app_instance:${id}`;
}

export function createAppInstanceEntity(appInstance: AppInstance): Entity {
  const { tags, ...other } = appInstance;

  return createIntegrationEntity({
    entityData: {
      source: other,
      assign: {
        _key: getAppInstanceKey(appInstance.instance_id),
        _type: Entities.APP_INSTANCE._type,
        _class: Entities.APP_INSTANCE._class,
        id: appInstance.instance_id,
        name: appInstance.instance_name,
        app: appInstance.app,
        type: appInstance.type,
        lastModifieid: parseTimePropertyValue(appInstance.last_modified),
      },
    },
  });
}
