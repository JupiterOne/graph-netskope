import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-and-build-user-configuration', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-and-build-user-configuration',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.FETCH_AND_BUILD_USER_CONFIGURATION,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
