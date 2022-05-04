import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: (entry) => {
      mutations.unzipGzippedRecordingEntry(entry);

      if (entry?.request?.postData?.text) {
        entry.request.postData.text = (
          entry.request.postData.text as string
        ).replace(
          new RegExp(/"token":"[a-zA-Z0-9]*"/g),
          '"token":"[REDACTED]"',
        );
      }
      if (entry?.response?.content?.text) {
        entry.response.content.text = (entry?.response?.content?.text as string)
          .replace(/ey":"[a-zA-Z0-9]{20}"/g, 'ey":"[REDACTED]"')
          .replace(
            /"SFCheckerIP":"[0-9]*[.][0-9]*[.][0-9]*[.][0-9]*"/g,
            '"SFCheckerIP":"[REDACTED]"',
          )
          .replace(
            /"nsdeviceuid":"[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}"/g,
            '"nsdeviceuid":"[REDACTED]"',
          );
      }
      return entry;
    },
    options: {
      matchRequestsBy: {
        url: {
          hostname: false,
        },
      },
    },
  });
}
