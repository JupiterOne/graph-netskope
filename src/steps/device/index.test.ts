import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';
import { omit } from 'lodash';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('build-tenant-and-device-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-tenant-and-device-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(IntegrationSteps.DEVICES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(omit(stepResult.collectedEntities[0], ['_rawData'])).toMatchSnapshot();
});
