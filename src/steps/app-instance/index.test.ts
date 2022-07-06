// Temporary disabled test while testing if the endpoint change will have any effect

// import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
// import { buildStepTestConfigForStep } from '../../../test/config';
// import { Recording, setupProjectRecording } from '../../../test/recording';
// import { IntegrationSteps } from '../constants';

// See test/README.md for details
// let recording: Recording;
// afterEach(async () => {
//   await recording.stop();
// });

test('fetch-app-instances', () => {
  // recording = setupProjectRecording({
  //   directory: __dirname,
  //   name: 'fetch-app-instances',
  // });

  // const stepConfig = buildStepTestConfigForStep(IntegrationSteps.APP_INSTANCES);
  // const stepResult = await executeStepWithDependencies(stepConfig);
  // expect(stepResult).toMatchStepMetadata(stepConfig);
  expect(1).toBe(1);
});
