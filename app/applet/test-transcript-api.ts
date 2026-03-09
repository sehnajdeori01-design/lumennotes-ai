import { YoutubeTranscriptApi } from 'youtube-transcript-api';

async function test() {
  try {
    const transcript = await YoutubeTranscriptApi.getTranscript('jNQXAC9IVRw');
    console.log("Length:", transcript.length);
    console.log(transcript.slice(0, 2));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
