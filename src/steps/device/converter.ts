import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Device } from '../../types';

export function getDeviceKey(id: string): string {
  return `netskope_device:${id}`;
}

export function createDeviceEntity(device: Device): Entity {
  const { attributes: dev } = device;

  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _key: getDeviceKey(dev._id),
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        id: dev._id,
        name: dev.host_info.hostname,
        clientInstallTime: dev.client_install_time,
        clientVersion: dev.client_version,
        category: dev.host_info.os,
        make: dev.host_info.device_make,
        model: dev.host_info.device_model,
        serial: dev.host_info.serialNumber ?? dev.host_info.nsdeviceuid,
        deviceId: dev.device_id,
        os: dev.host_info.os,
        osVersion: dev.host_info.os_version,
        lastEvent: dev.last_event.event,
        lastEventStatus: dev.last_event.status,
        lastEventNpaStatus: dev.last_event.npa_status,
        lastEventActor: dev.last_event.actor,
        lastEventOccurredOn: parseTimePropertyValue(
          dev.last_event.timestamp,
          'ms',
        ),
        lastSeenOn: parseTimePropertyValue(dev.last_event.timestamp, 'ms'),
      },
    },
  });
}
