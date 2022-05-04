import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-and-build-devices-and-users', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-and-build-devices-and-users',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_DEVICE_USER_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
