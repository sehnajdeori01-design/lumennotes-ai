import { YouTubeTranscriptApi } from 'youtube-captions-api';

async function test() {
  try {
    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetch('jNQXAC9IVRw');
    console.log("Length:", transcript.length);
    console.log(transcript.slice(0, 2));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
